/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, dateFnsLocalizer, SlotInfo, View, stringOrDate } from 'react-big-calendar';
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

// スマホ専用UIコンポーネント
function MobileCalendarUI({ 
  virtualEvents, 
  onRemoveVirtualEvent, 
  onCopy, 
  onReset, 
  copied, 
  selectedText,
  onAddVirtualEvent,
  events
}: {
  virtualEvents: VirtualEvent[];
  onRemoveVirtualEvent: (id: string) => void;
  onCopy: () => void;
  onReset: () => void;
  copied: boolean;
  selectedText: string;
  onAddVirtualEvent: (start: Date, end: Date) => void;
  events: CalendarEvent[];
}) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedStartTime, setSelectedStartTime] = useState<string>('');
  const [selectedEndTime, setSelectedEndTime] = useState<string>('');
  const [isSelectingEndTime, setIsSelectingEndTime] = useState(false);

  // 今日と明日の日付を生成
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // 時間オプション（30分単位）
  const timeOptions = useMemo(() => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(time);
      }
    }
    return times;
  }, []);

  // 選択された日付の予定を取得
  const selectedDateEvents = useMemo(() => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === selectedDate.toDateString();
    });
  }, [events, selectedDate]);

  // 選択された日付の翌日の予定を取得
  const nextDateEvents = useMemo(() => {
    const nextDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === nextDate.toDateString();
    });
  }, [events, selectedDate]);

  // 日付選択
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedStartTime('');
    setSelectedEndTime('');
    setIsSelectingEndTime(false);
  };

  // 時間選択（日付と時間を同時に選択）
  const handleTimeSelect = (time: string) => {
    setSelectedStartTime(time);
    setIsSelectingEndTime(true);
  };

  // 終了時間入力
  const handleEndTimeInput = (time: string) => {
    if (time > selectedStartTime) {
      setSelectedEndTime(time);
      
      // 仮想イベントとして追加
      const start = new Date(selectedDate);
      const [startHour, startMinute] = selectedStartTime.split(':').map(Number);
      start.setHours(startHour, startMinute, 0, 0);
      
      const end = new Date(selectedDate);
      const [endHour, endMinute] = time.split(':').map(Number);
      end.setHours(endHour, endMinute, 0, 0);
      
      // 親コンポーネントに仮想イベントを追加
      onAddVirtualEvent(start, end);
      
      // 選択状態をリセット
      setSelectedStartTime('');
      setSelectedEndTime('');
      setIsSelectingEndTime(false);
    }
  };

  // 時間スロットを生成（1時間単位）
  const timeSlots = useMemo(() => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }, []);

  // 特定の時間に予定があるかチェック
  const hasEventAtTime = (date: Date, time: string) => {
    const [hour] = time.split(':').map(Number);
    const timeDate = new Date(date);
    timeDate.setHours(hour, 0, 0, 0);
    
    // 指定された日付の予定を取得
    const dateEvents = events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
    
    return dateEvents.some(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      return timeDate >= eventStart && timeDate < eventEnd;
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* 選択された日時表示 */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {virtualEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-gray-400">日付と時間を選択すると、ここに候補日時が表示されます</p>
          </div>
        ) : (
          <div className="space-y-3">
            {virtualEvents.map((event, index) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800 font-semibold">
                    {format(event.start, "M月d日(E)", { locale: ja })}
                  </div>
                  <div className="text-xs text-gray-600">
                    {format(event.start, "HH:mm", { locale: ja })}〜{format(event.end, "HH:mm", { locale: ja })}
                  </div>
                </div>
                <button
                  onClick={() => onRemoveVirtualEvent(event.id)}
                  className="ml-3 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 flex-shrink-0"
                  title="削除"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 日付選択とカレンダー表示 */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() - 1);
              setSelectedDate(newDate);
              setSelectedStartTime('');
              setSelectedEndTime('');
              setIsSelectingEndTime(false);
            }}
            className="p-2 text-gray-600 hover:text-[#60859D] hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="前の日"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          
          <h3 className="text-lg font-semibold text-gray-800">カレンダー</h3>
          
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              newDate.setDate(newDate.getDate() + 1);
              setSelectedDate(newDate);
              setSelectedStartTime('');
              setSelectedEndTime('');
              setIsSelectingEndTime(false);
            }}
            className="p-2 text-gray-600 hover:text-[#60859D] hover:bg-gray-100 rounded-lg transition-all duration-200"
            title="次の日"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        {/* カレンダーグリッド表示 */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* ヘッダー */}
          <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200">
            <div className="p-3 text-center font-medium text-gray-700 border-r border-gray-200">
              {format(selectedDate, "d日 E", { locale: ja })}
            </div>
            <div className="p-3 text-center font-medium text-gray-700">
              {format(new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), "d日 E", { locale: ja })}
            </div>
          </div>
          
          {/* 時間スロット */}
          <div className="max-h-64 overflow-y-auto">
            {timeSlots.map((time) => {
              const nextDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
              
              return (
                <div key={time} className="grid grid-cols-2 border-b border-gray-100 last:border-b-0">
                  {/* 選択された日付の時間スロット */}
                  <div 
                    className={`p-2 border-r border-gray-200 cursor-pointer transition-colors duration-200 ${
                      selectedStartTime === time
                        ? 'bg-[#60859D] text-white'
                        : hasEventAtTime(selectedDate, time)
                        ? 'bg-[#60859D] text-white'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      handleDateSelect(selectedDate);
                      handleTimeSelect(time);
                    }}
                  >
                    <div className="text-xs font-medium">{time}</div>
                    {hasEventAtTime(selectedDate, time) && (
                      <div className="text-xs opacity-75">予定あり</div>
                    )}
                  </div>
                  
                  {/* 選択された日付の翌日の時間スロット */}
                  <div 
                    className={`p-2 cursor-pointer transition-colors duration-200 ${
                      selectedStartTime === time
                        ? 'bg-[#60859D] text-white'
                        : hasEventAtTime(nextDate, time)
                        ? 'bg-[#60859D] text-white'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      handleDateSelect(nextDate);
                      handleTimeSelect(time);
                    }}
                  >
                    <div className="text-xs font-medium">{time}</div>
                    {hasEventAtTime(nextDate, time) && (
                      <div className="text-xs opacity-75">予定あり</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 終了時間入力 */}
      {isSelectingEndTime && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">終了時間を選択</h3>
          
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              選択日: {format(selectedDate, "M月d日(E)", { locale: ja })}
            </p>
            <p className="text-sm text-[#60859D] font-medium">
              開始時間: {selectedStartTime} 〜 終了時間を選択
            </p>
          </div>
          
          <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto">
            {timeOptions
              .filter(time => time > selectedStartTime)
              .map((time) => (
                <button
                  key={time}
                  onClick={() => handleEndTimeInput(time)}
                  className="p-3 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all duration-200"
                >
                  {time}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* 操作ボタン */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col gap-3">
          <button
            className="w-full px-6 py-4 bg-gradient-to-r from-[#60859D] to-[#7a9bb3] hover:from-[#4a6b7d] hover:to-[#60859D] rounded-xl text-white font-semibold shadow-md transition-all duration-200 active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#60859D] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onCopy}
            disabled={!selectedText}
          >
            {copied ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                コピーしました！
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                文字をコピー
              </span>
            )}
          </button>
          
          <button
            className="w-full px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl shadow-sm transition-all duration-200 active:scale-98 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onReset}
            disabled={!selectedText}
          >
            <span className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              リセット
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [virtualEvents, setVirtualEvents] = useState<VirtualEvent[]>([]);
  const [copied, setCopied] = useState(false);
  const [calendarView, setCalendarView] = useState<View>('week');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  // 仮想イベント追加（スマホ専用UI用）
  const handleAddVirtualEvent = (start: Date, end: Date) => {
    const id = generateVirtualEventId(start, end);
    if (!virtualEvents.some(ev => ev.id === id)) {
      setVirtualEvents(prev => [...prev, { id, title: "選択枠", start, end }]);
      setCopied(false);
    }
  };

  // 仮想イベントの移動・リサイズ
  const handleVirtualEventMove = ({ event, start, end }: { event: any, start: stringOrDate, end: stringOrDate }) => {
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
    const isVirtual = virtualEvents.some(ev => ev.id === event.id);
    if (!isVirtual) { // Googleカレンダーのイベント
      return {
        style: {
          background: 'linear-gradient(135deg, #60859D 0%, #7a9bb3 100%)',
          color: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(96, 133, 157, 0.2)',
          transition: 'all 0.2s ease',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
      };
    }
    // 仮想イベント
    return {
      className: 'virtual-event',
      style: {
        background: 'linear-gradient(135deg, #48bb78 0%, #68d391 100%)',
        color: '#fff',
        borderRadius: 8,
        border: '2px solid #38a169',
        boxShadow: '0 4px 16px rgba(72, 187, 120, 0.3)',
        transition: 'all 0.2s ease',
      }
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 text-gray-800 flex flex-col items-center py-6 sm:py-12 font-sans">
      {/* ヘッダー部分 - モバイル対応 */}
      <div className="text-center mb-6 sm:mb-12 px-4 w-full">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide text-gray-800 mb-2 sm:mb-3">空きTime-Maker</h1>
        <p className="hidden lg:block text-base sm:text-lg text-gray-600 font-medium px-2">Googleカレンダーから空き時間を素早くテキスト化</p>
      </div>
      
      {/* ローディング表示 - モバイル対応 */}
      {loading && (
        <div className="mb-4 sm:mb-6 flex items-center justify-center px-4">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#60859D]"></div>
          <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600 font-medium">読み込み中...</span>
        </div>
      )}
      
      {/* エラー表示 - モバイル対応 */}
      {error && (
        <div className="mb-4 sm:mb-6 px-4 sm:px-6 py-3 bg-red-50 border border-red-200 rounded-lg text-red-700 font-medium text-sm sm:text-base mx-4">
          {error}
        </div>
      )}
      
      {/* デスクトップ用カレンダーUI（lg以上で表示） */}
      <div className="hidden lg:flex flex-col lg:flex-row w-full max-w-7xl gap-4 sm:gap-6 lg:gap-8 items-start px-4 sm:px-6">
        {/* カレンダー部分 */}
        <div className="w-full lg:w-3/4 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-3 sm:p-4 lg:p-6">
          <DnDCalendar
            localizer={localizer}
            events={allEvents}
            startAccessor={(event: any) => event.start}
            endAccessor={(event: any) => event.end}
            style={{ 
              height: 600, 
              background: 'transparent', 
              borderRadius: 16 
            }}
            views={['week', 'day']}
            defaultView={calendarView}
            onView={setCalendarView}
            selectable
            onSelectSlot={handleSelectSlot}
            popup
            eventPropGetter={eventStyleGetter}
            components={{ event: EventRenderer }}
            onEventDrop={({ event, start, end }) => handleVirtualEventMove({ event, start, end })}
            onEventResize={({ event, start, end }) => handleVirtualEventMove({ event, start, end })}
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
        <div className="w-full lg:w-80 bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-stretch">
          <h2 className="block mb-4 sm:mb-6 font-semibold text-lg sm:text-xl tracking-wide text-gray-800 border-b border-gray-100 pb-2 sm:pb-3">
            生成された候補日時
          </h2>
          
          <textarea
            className="w-full p-4 rounded-xl bg-gray-50 text-gray-700 text-lg mb-6 border border-gray-200 focus:ring-2 focus:ring-[#60859D] focus:border-[#60859D] transition-all duration-200 resize-none font-medium"
            rows={Math.max(4, virtualEvents.length)}
            value={selectedText}
            readOnly
            placeholder="空き時間を選択すると、ここに候補日時が表示されます"
          />
          
          {/* ボタン群 - 縦並び配置 */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <button
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-[#60859D] to-[#7a9bb3] hover:from-[#4a6b7d] hover:to-[#60859D] rounded-xl text-white font-semibold shadow-md transition-all duration-200 active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#60859D] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              onClick={handleCopy}
              disabled={!selectedText}
            >
              {copied ? (
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  コピーしました！
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  文字をコピー
                </span>
              )}
            </button>
            
            <button
              className="w-full px-4 sm:px-6 py-3 sm:py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl shadow-sm transition-all duration-200 active:scale-98 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              onClick={handleReset}
              disabled={!selectedText}
            >
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                リセット
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* スマホ専用UI（lg未満で表示） */}
      <div className="lg:hidden w-full max-w-md px-4">
        <MobileCalendarUI 
          virtualEvents={virtualEvents}
          onRemoveVirtualEvent={handleRemoveVirtualEvent}
          onCopy={handleCopy}
          onReset={handleReset}
          copied={copied}
          selectedText={selectedText}
          onAddVirtualEvent={handleAddVirtualEvent}
          events={events}
        />
      </div>
    </div>
  );
} 