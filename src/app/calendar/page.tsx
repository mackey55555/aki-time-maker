"use client";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, dateFnsLocalizer, SlotInfo, Event as RBCEvent, View, stringOrDate } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { ja } from 'date-fns/locale/ja';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './calendar-custom.css';

const locales = { 'ja': ja };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  organizer?: { email?: string };
  htmlLink?: string;
}

interface VirtualEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

function generateVirtualEventId(start: Date, end: Date) {
  return `${start.getTime()}-${end.getTime()}`;
}

const DnDCalendar = withDragAndDrop(Calendar);

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [virtualEvents, setVirtualEvents] = useState<VirtualEvent[]>([]);
  const [copied, setCopied] = useState(false);
  const [calendarView, setCalendarView] = useState<View>('week');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await supabase.auth.getSession();
        const accessToken = data.session?.provider_token;
        if (!accessToken) throw new Error("Googleアクセストークンがありません");

        const res = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=100&orderBy=startTime&singleEvents=true&timeMin=" + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const json = await res.json();
        const mapped = (json.items || []).map((item: any) => ({
          id: item.id,
          title: item.summary || "(タイトルなし)",
          start: new Date(item.start.dateTime || item.start.date),
          end: new Date(item.end.dateTime || item.end.date),
          organizer: item.organizer,
          htmlLink: item.htmlLink,
        }));
        setEvents(mapped);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // 選択範囲のテキスト化（複数）
  const selectedText = useMemo(() => {
    if (!virtualEvents.length) return "";
    const sortedEvents = [...virtualEvents].sort((a, b) => a.start.getTime() - b.start.getTime());
    return sortedEvents.map(ev => {
      const start = ev.start;
      const end = ev.end;
      const startStr = format(start, "M月d日(E) HH:mm", { locale: ja });
      const endStr = format(end, "HH:mm", { locale: ja });
      return `${startStr}〜${endStr}`;
    }).join("\n");
  }, [virtualEvents]);

  // 空き時間を選択して仮想イベントとして追加
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    // 既存と重複しない場合のみ追加
    const start = slotInfo.start as Date;
    const end = slotInfo.end as Date;
    const id = generateVirtualEventId(start, end);
    if (!virtualEvents.some(ev => ev.id === id)) {
      setVirtualEvents(prev => [...prev, { id, title: "選択枠", start, end }]);
      setCopied(false);
    }
  };

  // 仮想イベント削除
  const handleRemoveVirtualEvent = (id: string) => {
    setVirtualEvents(prev => prev.filter(ev => ev.id !== id));
    setCopied(false);
  };

  // 仮想イベントの移動・リサイズ
  const handleVirtualEventMove = ({ event, start, end }: { event: VirtualEvent, start: stringOrDate, end: stringOrDate }) => {
    setVirtualEvents(prev => prev.map(ev =>
      ev.id === event.id ? { ...ev, start: new Date(start), end: new Date(end), id: generateVirtualEventId(new Date(start), new Date(end)) } : ev
    ));
    setCopied(false);
  };

  // コピー
  const handleCopy = () => {
    if (selectedText) {
      navigator.clipboard.writeText(selectedText);
      setCopied(true);
    }
  };

  // リセット
  const handleReset = () => {
    setVirtualEvents([]);
    setCopied(false);
  };

  // カスタムイベントレンダラー
  const EventRenderer = ({ event }: { event: any }) => {
    const isVirtual = virtualEvents.some(ev => ev.id === event.id);
    return (
      <>
        <span>{event.title}</span>
        {isVirtual && (
          <span
            className="delete-btn"
            title="削除"
            onClick={e => { e.stopPropagation(); handleRemoveVirtualEvent(event.id); }}
          >
            ×
          </span>
        )}
      </>
    );
  };

  // カレンダーに表示するイベント（Google予定＋仮想イベント）
  const allEvents = useMemo(() => [
    ...events,
    ...virtualEvents.map(ev => ({ ...ev, title: "選択枠", allDay: false })),
  ], [events, virtualEvents]);

  // 仮想イベントの色分け
  const eventStyleGetter = (event: any) => {
    if (virtualEvents.some(ev => ev.id === event.id)) {
      return {
        className: 'virtual-event',
        style: {
          background: 'linear-gradient(90deg, #34d399 0%, #60a5fa 100%)',
          color: '#fff',
          borderRadius: 10,
          border: '2px solid #16a34a',
          opacity: 0.97,
          boxShadow: '0 4px 24px 0 #34d39944',
          transition: 'all 0.2s',
        }
      };
    }
    return {
      style: {
        background: 'linear-gradient(90deg, #3b82f6 0%, #6366f1 100%)',
        color: '#fff',
        borderRadius: 10,
        boxShadow: '0 2px 12px 0 #3b82f644',
        transition: 'all 0.2s',
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white flex flex-col items-center py-10 font-sans">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">空きTime-Maker</h1>
        <p className="text-lg text-gray-400 mt-2">Googleカレンダーから空き時間を素早くテキスト化</p>
      </div>
      {loading && <div className="mb-4 animate-pulse text-lg">読み込み中...</div>}
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-10 items-start">
        {/* カレンダー部分 */}
        <div className="flex-1 w-full md:w-2/3 bg-white/10 rounded-2xl shadow-2xl p-6 backdrop-blur-md border border-white/10">
          <DnDCalendar
            localizer={localizer}
            events={allEvents}
            startAccessor={(event: any) => event.start}
            endAccessor={(event: any) => event.end}
            style={{ height: 600, background: 'transparent', borderRadius: 20 }}
            views={['week', 'day']}
            defaultView={calendarView}
            onView={setCalendarView}
            selectable
            onSelectSlot={handleSelectSlot}
            popup
            eventPropGetter={eventStyleGetter}
            components={{ event: EventRenderer }}
            onEventDrop={({ event, start, end }) => handleVirtualEventMove({ event: event as VirtualEvent, start, end })}
            onEventResize={({ event, start, end }) => handleVirtualEventMove({ event: event as VirtualEvent, start, end })}
            draggableAccessor={(event: any) => virtualEvents.some(ev => ev.id === event.id)}
            resizable
            toolbar={true}
            messages={{
              week: '週', day: '日', today: '今日', previous: '前', next: '次',
            }}
            culture="ja"
          />
        </div>
        {/* 選択リスト部分 */}
        <div className="w-full md:w-96 bg-white/10 rounded-2xl shadow-2xl p-8 flex flex-col items-stretch border border-white/10 backdrop-blur-md">
          <label className="block mb-3 font-bold text-lg tracking-wide">生成された候補日時</label>
          <textarea
            className="w-full p-3 rounded-xl bg-gray-900/80 text-green-300 text-lg mb-4 border border-green-400/30 focus:ring-2 focus:ring-green-400 transition"
            rows={Math.max(4, virtualEvents.length)}
            value={selectedText}
            readOnly
          />
          <button
            className="px-5 py-3 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 rounded-xl text-white font-bold mb-3 shadow-lg transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400"
            onClick={handleCopy}
            disabled={!selectedText}
          >
            {copied ? <span className="animate-pulse">コピーしました！</span> : "文字をコピー"}
          </button>
          <button
            className="px-5 py-3 bg-gray-700 hover:bg-gray-800 rounded-xl text-white font-bold shadow transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={handleReset}
            disabled={!selectedText}
          >
            リセット
          </button>
        </div>
      </div>
    </div>
  );
} 