import Link from 'next/link';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">利用規約</h1>
          <p className="text-lg text-gray-600">空きTime-Makerの利用に関する規約について</p>
        </div>

        {/* 内容 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. サービスの概要</h2>
            <p className="text-gray-700 leading-relaxed">
              空きTime-Maker（以下「本サービス」）は、Googleカレンダーとの連携を通じて、
              ユーザーの空き時間を特定し、テキスト形式で出力するWebアプリケーションサービスです。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. 利用条件</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              本サービスの利用にあたり、以下の条件に同意していただく必要があります：
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>Googleアカウントをお持ちであること</li>
              <li>Googleカレンダーへのアクセス権限を付与すること</li>
              <li>本規約に従ってサービスを利用すること</li>
              <li>適切な目的でのみサービスを利用すること</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. 禁止事項</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              以下の行為は禁止されています：
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>法令または公序良俗に違反する行為</li>
              <li>犯罪行為に関連する行為</li>
              <li>当社のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為</li>
              <li>本サービスの運営を妨害するおそれのある行為</li>
              <li>他のユーザーに迷惑をかける行為</li>
              <li>他のユーザーの個人情報等を収集または蓄積する行為</li>
              <li>他のユーザーに成りすます行為</li>
              <li>当社のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. サービスの提供</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              当社は、本サービスの内容変更、中断、終了を、ユーザーに通知することなく行うことができるものとします。
              当社は、これによってユーザーまたは第三者に生じた損害について、一切の責任を負いません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. 免責事項</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              当社は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
            </p>
            <p className="text-gray-700 leading-relaxed">
              また、以下の場合についても責任を負いません：
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>Googleカレンダーサービスの障害や制限による影響</li>
              <li>ユーザーの操作ミスによるデータの損失</li>
              <li>ネットワーク環境の問題によるサービスの利用不可</li>
              <li>予期しない技術的問題によるサービスの停止</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. 知的財産権</h2>
            <p className="text-gray-700 leading-relaxed">
              本サービスで提供されるコンテンツ、デザイン、ロゴ、商標等の知的財産権は、
              当社または当社にライセンスを許諾している者に帰属します。
              ユーザーは、これらを無断で使用、複製、改変、配布等することはできません。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. 準拠法・管轄裁判所</h2>
            <p className="text-gray-700 leading-relaxed">
              本規約の解釈にあたっては、日本法を準拠法とします。
              また、本サービスに関して紛争が生じた場合には、東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">8. お問い合わせ</h2>
            <p className="text-gray-700 leading-relaxed">
              利用規約に関するご質問やご要望がございましたら、
              以下の方法でお気軽にお問い合わせください。
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>連絡先：</strong> a.makihara55555@gmail.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">9. 更新履歴</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>2025年8月：</strong> 初版作成・公開
              </p>
            </div>
          </section>
        </div>

        {/* 戻るボタン */}
        <div className="text-center mt-8">
          <Link 
            href="/calendar"
            className="inline-flex items-center px-6 py-3 bg-[#60859D] text-white font-semibold rounded-lg hover:bg-[#4a6b7d] transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            カレンダーに戻る
          </Link>
        </div>
      </div>
    </div>
  );
} 