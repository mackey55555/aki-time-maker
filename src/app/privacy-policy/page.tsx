import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">プライバシーポリシー</h1>
          <p className="text-lg text-gray-600">空きTime-Makerのプライバシー保護方針について</p>
        </div>

        {/* 内容 */}
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">1. 情報収集について</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              空きTime-Makerは、Googleカレンダーとの連携を通じて、ユーザーの予定情報を取得します。
              これにより、空き時間の特定とテキスト化サービスを提供いたします。
            </p>
            <p className="text-gray-700 leading-relaxed">
              収集される情報には以下が含まれます：
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>Googleアカウントの基本情報（メールアドレス、表示名）</li>
              <li>カレンダーの予定情報（開始時刻、終了時刻、タイトル）</li>
              <li>アプリケーションの利用状況データ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">2. 情報の使用目的</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              収集した情報は、以下の目的でのみ使用されます：
            </p>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>空き時間の特定と表示</li>
              <li>テキスト形式での空き時間情報の生成</li>
              <li>サービスの改善とユーザー体験の向上</li>
              <li>技術的な問題の解決</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">3. 情報の共有</h2>
            <p className="text-gray-700 leading-relaxed">
              ユーザーの個人情報やカレンダー情報を、第三者に販売、貸与、または提供することはありません。
              ただし、以下の場合を除きます：
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>ユーザーの明示的な同意がある場合</li>
              <li>法的な要求がある場合</li>
              <li>サービスの提供に必要な場合（例：Google APIとの連携）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">4. データの保護</h2>
            <p className="text-gray-700 leading-relaxed">
              ユーザーのデータ保護のために、以下の対策を実施しています：
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>HTTPS通信による暗号化</li>
              <li>アクセス制御と認証の実装</li>
              <li>定期的なセキュリティ監査</li>
              <li>データの最小化原則の適用</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">5. ユーザーの権利</h2>
            <p className="text-gray-700 leading-relaxed">
              ユーザーは以下の権利を有します：
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
              <li>個人情報の開示請求</li>
              <li>個人情報の訂正・削除請求</li>
              <li>データ処理の停止請求</li>
              <li>データの可搬性の要求</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">6. お問い合わせ</h2>
            <p className="text-gray-700 leading-relaxed">
              プライバシーポリシーに関するご質問やご要望がございましたら、
              以下の方法でお気軽にお問い合わせください。
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>連絡先：</strong> a.makihara55555@gmail.com
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">7. 更新履歴</h2>
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