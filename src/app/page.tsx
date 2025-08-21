import Image from "next/image";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-light tracking-wide text-gray-800 mb-4">空きTime-Maker</h1>
          <p className="text-xl text-gray-600 font-medium">Googleカレンダーから空き時間を素早くテキスト化</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-2xl">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">使い方</h2>
          <ol className="list-inside list-decimal text-base text-gray-700 space-y-4">
            <li className="tracking-wide leading-relaxed">
              <span className="font-medium">Googleカレンダーにログイン</span>して、あなたの予定を同期します
            </li>
            <li className="tracking-wide leading-relaxed">
              <span className="font-medium">空き時間を選択</span>して、候補日時を作成します
            </li>
            <li className="tracking-wide leading-relaxed">
              <span className="font-medium">生成された候補日時をコピー</span>して、他のアプリで使用できます
            </li>
          </ol>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-xl border border-solid border-transparent transition-all duration-200 flex items-center justify-center bg-[#60859D] hover:bg-[#4a6b7d] text-white gap-2 font-medium text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 sm:w-auto shadow-md hover:shadow-lg active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#60859D] focus:ring-offset-2"
            href="/calendar"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            カレンダーを開く
          </a>
          <a
            className="rounded-xl border border-solid border-gray-200 transition-all duration-200 flex items-center justify-center hover:bg-gray-50 hover:border-[#60859D] text-gray-700 hover:text-[#60859D] font-medium text-sm sm:text-base h-12 sm:h-14 px-6 sm:px-8 w-full sm:w-auto shadow-sm hover:shadow-md active:scale-98 focus:outline-none focus:ring-2 focus:ring-[#60859D] focus:ring-offset-2"
            href="https://github.com/your-repo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            GitHub
          </a>
        </div>
      </main>
      
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center text-gray-600">
        <a
          className="flex items-center gap-2 hover:text-[#60859D] hover:underline hover:underline-offset-4 transition-colors duration-200"
          href="/docs"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          ドキュメント
        </a>
        <a
          className="flex items-center gap-2 hover:text-[#60859D] hover:underline hover:underline-offset-4 transition-colors duration-200"
          href="/support"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd" />
          </svg>
          サポート
        </a>
        <a
          className="flex items-center gap-2 hover:text-[#60859D] hover:underline hover:underline-offset-4 transition-colors duration-200"
          href="/privacy"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          プライバシー
        </a>
      </footer>
    </div>
  );
}
