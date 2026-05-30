export interface Article {
  id: string;
  title: string;
  share_title?: string; // OGP/Twitter用の短縮タイトル（30文字以内推奨）
  date: string;
  content: string; // HTML content
  thumbnail?: string;
  thumbnail_text?: string;
  tags?: string[];
}

// 楽天記事削除
export const articles: Article[] = [
{
  id: 'gaitame-swap-campaign-202606',
  title: '外為どっとコムの「スワップポイント最大60％増額キャンペーン」が6月も開催！10万円からでも30％上乗せのチャンス',
  share_title: 'スワップ最大60％増額キャンペーンが6月も開催！（外為どっとコム）',
  date: '2026/05/30',
  thumbnail: '/images/gaitame-swap-campaign-202606_60.png',
  tags: ['FX', 'トルコリラ', 'スワップ投資', '外為どっとコム', 'キャンペーン'],
  content: `
    <p class="intro">
      外為どっとコムにて、2026年6月も<strong>「スワップポイント最大60％増額キャンペーン」</strong>が開催されます。<br>
      ポイントは、<strong>100万円以上の入金で60％増額</strong>、10万円以上の入金でも30％増額が受けられる点です。
    </p>

    <h3>【まずは結論：合計でいくら上乗せ？】</h3>
    <p>公式シミュレーションでは、対象3通貨ペアを組み合わせて運用すると、合計で次のポイントが上乗せされます。</p>
    <ul>
      <li><strong>入金100万円以上（60％増額）：</strong> 合計 <span style="color: #ef4444; font-weight: bold;">76,480円相当</span> のFXポイント上乗せ</li>
      <li><strong>入金10万円以上〜100万円未満（30％増額）：</strong> 合計 <span style="color: #ef4444; font-weight: bold;">38,240円相当</span> のFXポイント上乗せ</li>
    </ul>

    <h3>【通貨ペア別：シミュレーション内訳（60％増額時）】</h3>
    <p>合計76,480円相当の内訳は、3通貨ペアそれぞれ次の保有例で計算されています（1Lot＝1,000通貨）。</p>
    <table class="article-table">
      <thead>
        <tr>
          <th>対象通貨ペア・ポジション</th>
          <th>保有例</th>
          <th>上乗せ額</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>米ドル/トルコリラ（売）</td>
          <td>10万通貨を6日間</td>
          <td><strong>29,880円相当</strong></td>
        </tr>
        <tr>
          <td>ユーロ/トルコリラ（売）</td>
          <td>10万通貨を5日間＋5万通貨を1日間</td>
          <td><strong>36,850円相当</strong></td>
        </tr>
        <tr>
          <td>トルコリラ/円（買）</td>
          <td>50万通貨を13日間</td>
          <td><strong>9,750円相当</strong></td>
        </tr>
        <tr>
          <td><strong>合計</strong></td>
          <td>—</td>
          <td><strong style="color: #ef4444;">76,480円相当</strong></td>
        </tr>
      </tbody>
    </table>
    <p style="font-size: 0.9em; color: #666;">※入金10万円以上〜100万円未満（30％増額）の場合は、上記の半分（合計38,240円相当）が目安です。</p>

    <h3>【通貨ペア別：1日あたりの上乗せ目安】</h3>
    <p>60％増額が適用された場合、一定数量を1日保有したときの上乗せ目安は次の通りです。</p>
    <table class="article-table">
      <thead>
        <tr>
          <th>対象通貨ペア・ポジション</th>
          <th>数量</th>
          <th>1日あたりの上乗せ目安</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>トルコリラ/円（買）</td>
          <td>10万通貨</td>
          <td>約150円相当上乗せ</td>
        </tr>
        <tr>
          <td>米ドル/トルコリラ（売）</td>
          <td>1万通貨</td>
          <td>約498円相当上乗せ</td>
        </tr>
        <tr>
          <td>ユーロ/トルコリラ（売）</td>
          <td>1万通貨</td>
          <td>約670円相当上乗せ</td>
        </tr>
      </tbody>
    </table>

    <h3>【上限Lotまで建てたら？キャンペーン期間中、最大上乗せ】</h3>
    <p>上乗せ対象の上限数量を全ペア同時に建て、キャンペーン期間をフルに保有した場合、上乗せは最大で次の通りです（公式単価からの当サイト試算）。</p>
    <p style="font-size: 0.9em; color: #666;">※付与日数は27日で計算（公式シミュレーション例から逆算。水曜クローズは3日分付与のため）。</p>
    <table class="article-table">
      <thead>
        <tr>
          <th>対象通貨ペア・ポジション</th>
          <th>上限数量</th>
          <th>1日あたり</th>
          <th>期間合計（27日）</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>米ドル/トルコリラ（売）</td>
          <td>200Lot（20万通貨）</td>
          <td>約9,960円</td>
          <td>約268,920円相当</td>
        </tr>
        <tr>
          <td>ユーロ/トルコリラ（売）</td>
          <td>200Lot（20万通貨）</td>
          <td>約13,400円</td>
          <td>約361,800円相当</td>
        </tr>
        <tr>
          <td>トルコリラ/円（買）</td>
          <td>1,000Lot（100万通貨）</td>
          <td>約1,500円</td>
          <td>約40,500円相当</td>
        </tr>
        <tr>
          <td><strong>3ペア合計</strong></td>
          <td>—</td>
          <td>約24,860円</td>
          <td><strong style="color: #ef4444;">約671,220円相当</strong></td>
        </tr>
      </tbody>
    </table>
    <p style="font-size: 0.9em; color: #666;">※入金100万円以上（60％増額）で全ペア上限Lotをフル期間保有した理論上の最大値です。30％増額時は半額の約335,610円相当。実際にはこの規模の建玉には多額の証拠金が必要で、スワップも日々変動します。あくまで上限の目安としてご覧ください。</p>

    <h3>【キャンペーン概要】</h3>
    <div class="campaign-details">
      <ul>
        <li><strong>対象期間：</strong> 2026年6月1日(月)午前7時00分 ～ 2026年6月27日(土)午前5時55分</li>
        <li><strong>条件：</strong> 期間中の純増額（入金−出金）が10万円以上で30％増額、100万円以上で60％増額</li>
        <li><strong>対象：</strong> 『外貨ネクストネオ』でのトルコリラ/円（買）、米ドル/トルコリラ（売）、ユーロ/トルコリラ（売）の新規ポジション</li>
        <li>
          <strong>上乗せ上限数量：</strong><br>
          ・トルコリラ/円：1,000Lot（100万通貨）まで<br>
          ・米ドル/トルコリラ・ユーロ/トルコリラ：各200Lot（20万通貨）まで
        </li>
      </ul>
    </div>

    <h3>【参加するための必須条件・注意点】</h3>
    <ul>
      <li>専用フォームからの<strong>「エントリー」</strong>が必須です。入金・取引後でも、期間内のエントリーなら有効です。</li>
      <li>特典のFXポイント（1ポイント＝1円）を受け取るには、期間終了までに<strong>『らくらくFX積立』の口座開設</strong>が必要です。</li>
      <li>上乗せ額は、過去4週間（2026年4月27日〜5月22日）の受取スワップポイント平均値を基準に算出されます。</li>
      <li>他キャンペーンと重複適用が可能です（重複不可の記載があるものを除く）。</li>
    </ul>

    <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">

    <p>
      トルコリラなどの新興国通貨は相場の急変動リスクがあります。ただ、こうした増額キャンペーンを賢く併用すれば、より効率的なスワップ運用を狙えます。<br>
      まずは詳細をチェックし、エントリーを済ませておきましょう。
    </p>

    <div class="campaign-link" style="margin-top: 30px;">
      <p style="font-weight: bold; color: #2563eb;">▼キャンペーンの詳細とエントリーはこちら</p>
      <a href="https://www.gaitame.com/campaign/increase-swap-2606/" target="_blank" rel="noopener noreferrer">
        https://www.gaitame.com/campaign/increase-swap-2606/
      </a>
    </div>
  `,
},
{
  id: 'gaitame-swap-campaign-202605',
  title: '外為どっとコムの「スワップポイント最大60％増額キャンペーン」が5月も開催！10万円からでも30％上乗せのチャンス',
  share_title: 'スワップ最大60％増額キャンペーンが5月も開催！（外為どっとコム）',
  date: '2026/05/02',
  thumbnail: '/images/gaitame-swap-campaign-202605_60.png',
  tags: ['FX', 'トルコリラ', 'スワップ投資', '外為どっとコム', 'キャンペーン'],
  content: `
    <p class="intro">
      外為どっとコムにて、2026年5月も非常にお得な<strong>「スワップポイント最大60％増額キャンペーン」</strong>が実施されます！<br>
      今回の注目ポイントも、<strong>100万円以上の入金で60％増額</strong>、10万円以上の入金でも30％増額の恩恵を受けられる点です。
    </p>

    <h3>【通貨ペア別：具体的にいくらポイントが貯まる？】</h3>
    <p>公式サイトのシミュレーション例（100万円以上入金・60％増額適用時）に基づき、各通貨ペアを運用した場合の獲得ポイントを算出しました。</p>
    <p style="font-size: 0.9em; color: #666;">※1Lot＝1,000通貨単位</p>

    <ul>
      <li>
        <strong>米ドル/トルコリラ（売）：31,560円相当</strong><br>
        10万通貨（100Lot）を平日の付与日数計6日間保有した場合（1Lotあたり1日52.60円上乗せ）。
      </li>
      <li>
        <strong>ユーロ/トルコリラ（売）：38,610円相当</strong><br>
        10万通貨を5日間、その後5万通貨を1日間保有した場合（1Lotあたり1日70.20円上乗せ）。
      </li>
      <li>
        <strong>トルコリラ/円（買）：9,750円相当</strong><br>
        50万通貨（500Lot）を13日間保有した場合（1Lotあたり1日1.50円上乗せ）。
      </li>
    </ul>

    <p>これらを組み合わせることで、キャンペーン期間中に合計 <strong>79,920円相当</strong>（入金10万円以上〜100万円未満の場合は39,960円相当）のポイント上乗せが期待できます！</p>

    <h3>【キャンペーン概要】</h3>
    <div class="campaign-details">
      <ul>
        <li><strong>対象期間：</strong> 2026年5月4日(月)午前7時00分 ～ 2026年5月30日(土)午前5時55分</li>
        <li><strong>対象通貨ペア：</strong> トルコリラ/円（買）、米ドル/トルコリラ（売）、ユーロ/トルコリラ（売）</li>
        <li>
          <strong>上乗せ上限数量：</strong><br>
          ・トルコリラ/円：1,000Lot（100万通貨）まで<br>
          ・米ドル/トルコリラ・ユーロ/トルコリラ：各200Lot（20万通貨）まで
        </li>
      </ul>
    </div>

    <h3>【参加するための必須条件・注意点】</h3>
    <ul>
      <li>専用フォームからの<strong>「エントリー」</strong>が必須です。入金・取引後でも期間内のエントリーなら有効です。</li>
      <li>特典のFXポイント（1ポイント＝1円）を受け取るには、期間終了までに<strong>『らくらくFX積立』の口座開設</strong>が必要です。</li>
      <li>上乗せ額は、過去4週間（2026年3月30日〜4月24日）の受取スワップポイント平均値を基準に算出されます。</li>
    </ul>

    <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">

    <p>
      トルコリラなどの新興国通貨は相場の急変動リスクがありますが、このような増額キャンペーンを賢く併用することで、より効率的なスワップ運用が検討可能です。
      まずは詳細をチェックして、エントリーを済ませておきましょう！
    </p>

    <div class="campaign-link" style="margin-top: 30px;">
      <p style="font-weight: bold; color: #2563eb;">▼キャンペーンの詳細とエントリーはこちら</p>
      <a href="https://www.gaitame.com/campaign/increase-swap-2605/" target="_blank" rel="noopener noreferrer">
        https://www.gaitame.com/campaign/increase-swap-2605/
      </a>
    </div>
  `,
},
{
  id: 'invast-tryauto-tryswap-campaign-202605',
  title: '【2026年5月】インヴァスト証券：トルコリラ/円スワップ50%増額キャンペーンが再び開催！',
  share_title: 'トルコリラ/円スワップ50%増額キャンペーンが5月も開催！（インヴァスト証券）',
  date: '2026/05/01',
  thumbnail: '/images/invast-tryauto-tryswap-campaign-202605_60.png',
  tags: ['FX', 'トルコリラ', 'スワップ投資', 'インヴァスト証券', 'キャンペーン'],
  content: `
    <p class="intro">
      2026年3月に好評だったスワップ増額キャンペーンが、5月もインヴァスト証券の「トライオートFX」で実施されます。トルコリラ/円（TRY/JPY）を運用中の方や、これから新規でポジションを持ちたい方にとって、収益を上乗せする絶好のチャンスです。
    </p>

    <h3>1. キャンペーン概要：トルコリラ/円スワップ50%増額</h3>
    <p>
      今回のキャンペーンでは、対象期間中のトルコリラ/円の新規買建玉の増加分に対し、スワップポイントが50%上乗せされます。
    </p>

    <div class="campaign-details">
      <ul>
        <li><strong>開催期間：</strong> 2026年5月1日（金）取引開始 ～ 2026年5月29日（金）取引終了</li>
        <li><strong>特典内容：</strong> 1万通貨あたり、1日につき13.5円の上乗せ（キャッシュバック）</li>
        <li><strong>対象取引：</strong> 裁量（マニュアル）取引、および自動売買のどちらも対象です</li>
      </ul>
      <p style="font-size: 0.9em; margin-top: 10px; border-top: 1px dashed #ccc; padding-top: 10px;">
        ※この金額は2026年4月前半の受取スワップ平均値の50%に基づき算出されています。
      </p>
    </div>

    <h3>2. 主な適用条件と注意点</h3>
    <p>キャンペーンの適用には、以下の条件を満たす必要があります。</p>
    <ul>
      <li><strong>専用フォームからの申し込み：</strong> キャンペーン期間中、応募フォームからのエントリーが必須です。</li>
      <li><strong>新規買建玉の増加分が対象：</strong> <strong>基準日（2026年4月30日（木）クローズ時点）</strong>の建玉数量と比較して、増加した買いポジションが対象となります。</li>
      <li><strong>建玉上限：</strong> 対象となる建玉数量の上限は、最大50万通貨までです。</li>
      <li><strong>対象外：</strong> 売建玉（マイナススワップ）は対象外となります。また、新規口座開設キャンペーンとの併用はできません。</li>
    </ul>

    <h3>3. 付与時期</h3>
    <p>
      <strong>入金時期：</strong> キャンペーン終了後の2026年6月末までに、トライオートFXの取引口座へまとめて入金されます。
    </p>

    <hr style="margin: 30px 0; border: 0; border-top: 1px solid #eee;">

    <p>
      3月のキャンペーン時と同様、今回も<strong>「期間中の新規ポジション増加分」</strong>がキャッシュバックの対象となります。5月はインヴァスト証券のキャンペーンを賢く利用して、スワップ投資の最大化を狙ってみてはいかがでしょうか。
    </p>

    <div class="campaign-link" style="margin-top: 30px;">
      <p style="font-weight: bold; color: #2563eb;">▼キャンペーンの詳細とエントリーはこちら</p>
      <a href="https://www.invast.jp/triauto/campaign/fx/tryswap/202605/" target="_blank" rel="noopener noreferrer">
        https://www.invast.jp/triauto/campaign/fx/tryswap/202605/
      </a>
    </div>
  `,
  },
{
  id: 'hormuz-supply-shock-xday-20260413',
  title: 'ホルムズ封鎖で供給ショックが訪れる「Xデイ」── 備蓄は7月上旬に枯渇か？',
  share_title: '備蓄は7月上旬に枯渇か？ ── ホルムズ封鎖「Xデイ」',
  thumbnail_text: 'ホルムズ封鎖\n供給ショック\n備蓄は7月上旬に枯渇か？',
  date: '2026/04/13',
  thumbnail: '/images/hormuz-supply-shock-xday-20260413_60.png',
  tags: ['原油価格', 'ホルムズ海峡', 'イラン戦争', '供給ショック', '備蓄', 'ガソリン価格'],
  content: `
    <p class="intro">
      2月28日の対イラン軍事作戦から約1ヶ月半。4月12日にはイスラマバードでの和平交渉が決裂し、トランプ大統領はホルムズ海峡の海上封鎖を宣言しました（<a href="https://www.cbsnews.com/news/trump-strait-of-hormuz-blockade-iran/" target="_blank" rel="noopener noreferrer">CBS News</a>）。原油は$60台から$95前後へ約5割上昇 ── ガソリン・光熱費への波及も始まっていますが、本当の供給ショックはまだ来ていません。公開データとアナリストの分析をもとに、備蓄がいつ尽き、原油価格がいつ次の急騰局面を迎えるのかを予測します。
    </p>

    <h3>供給ギャップの全体像 ── 足りないのは日量1,100万バレル</h3>
    <p>
      ホルムズ海峡は平時に日量約2,000万バレルの原油が通過する世界最大のチョークポイントです（<a href="https://www.eia.gov/todayinenergy/detail.php?id=65504" target="_blank" rel="noopener noreferrer">EIA</a>）。陸路のパイプラインによる迂回手段を考慮しても、日量1,100万バレル ── <strong>世界の石油供給の約1割</strong>が不足します。
    </p>

    <table class="article-table">
      <thead>
        <tr>
          <th>供給の内訳</th>
          <th>日量（百万バレル）</th>
          <th>備考</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>ホルムズ海峡 通常通過量</td>
          <td style="text-align: right; font-weight: bold;">~20</td>
          <td>世界の海上原油輸送の約20%</td>
        </tr>
        <tr>
          <td colspan="3" style="background: #f8fafc; font-weight: bold; color: #475569;">迂回手段（パイプライン）</td>
        </tr>
        <tr>
          <td>　サウジ東西パイプライン（ヤンブー向け）</td>
          <td style="text-align: right;">5〜7</td>
          <td>3/28に日量700万バレルに到達（<a href="https://fortune.com/2026/03/28/saudi-arabia-east-west-oil-pipeline-strait-hormuz-bypass-7-million-barrels-yanbu-red-sea/" target="_blank" rel="noopener noreferrer">Fortune</a>）</td>
        </tr>
        <tr>
          <td>　UAE ADCOPパイプライン（フジャイラ向け）</td>
          <td style="text-align: right;">1.5〜1.8</td>
          <td></td>
        </tr>
        <tr>
          <td>　イラク→トルコ セイハンパイプライン</td>
          <td style="text-align: right;">0.3</td>
          <td>能力限定的</td>
        </tr>
        <tr>
          <td>　<strong>パイプライン合計</strong></td>
          <td style="text-align: right; font-weight: bold;">~9</td>
          <td></td>
        </tr>
        <tr style="background: #fef2f2;">
          <td><strong>純供給ギャップ（迂回不能分）</strong></td>
          <td style="text-align: right; color: #ef4444; font-weight: bold;">~11</td>
          <td>世界供給の約11%が消失</td>
        </tr>
      </tbody>
    </table>

    <p>
      この日量1,100万バレルの不足分を埋めるのが、<strong>備蓄放出</strong>と<strong>OPEC余剰生産能力</strong>です。しかし、どちらにも限りがあります。
    </p>

    <h3>備蓄放出 ── 史上最大の放出でも「20日分」</h3>
    <p>
      3月11日、IEA加盟32カ国は史上最大の<strong>4億バレル</strong>の協調備蓄放出を決定しました（<a href="https://www.iea.org/news/iea-member-countries-to-carry-out-largest-ever-oil-stock-release-amid-market-disruptions-from-middle-east-conflict" target="_blank" rel="noopener noreferrer">IEA</a>）。しかし、この数字の意味を冷静に見る必要があります。
    </p>

    <div class="campaign-details">
      <h3 style="margin-top: 0;">4億バレルの正体</h3>
      <p style="font-size: 0.9em; color: #64748b; margin-bottom: 10px;">※ 何日分の供給に相当するかは、分母の取り方で大きく変わります。</p>
      <ul>
        <li>世界全体の消費量（日量約1億バレル）で割ると → <strong>わずか4日分</strong></li>
        <li>ホルムズ途絶量（日量2,000万バレル）で割ると → <strong>約20日分</strong></li>
        <li>IEA加盟国の備蓄総量（約12.5億バレル）の<strong>33%</strong>を放出</li>
        <li>米国だけでSPR残高4.15億バレルの<strong>41%</strong>にあたる1.72億バレルを放出</li>
      </ul>
    </div>

    <h4>各国の備蓄と枯渇タイミング</h4>
    <table class="article-table">
      <thead>
        <tr>
          <th>国・地域</th>
          <th>備蓄量</th>
          <th>放出ペース</th>
          <th>枯渇の目安</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>米国SPR</td>
          <td>4.15億バレル（うち1.72億放出）</td>
          <td>日量140万バレル/120日間</td>
          <td style="color: #ef4444; font-weight: bold;">7月上旬</td>
        </tr>
        <tr>
          <td>日本</td>
          <td>230日分（4/6時点、官民合計）</td>
          <td>計70日分を2段階で放出（<a href="https://www.nikkei.com/article/DGXZQOUA0971B0Z00C26A4000000/" target="_blank" rel="noopener noreferrer">日経</a>）</td>
          <td style="color: #ef4444; font-weight: bold;">第1弾4月末、第2弾5〜6月</td>
        </tr>
        <tr>
          <td>中国</td>
          <td>推定約12億バレル（非公開）</td>
          <td>中東輸入の約5ヶ月分</td>
          <td style="color: #f59e0b;">8月頃</td>
        </tr>
        <tr>
          <td>IEA 32カ国合計</td>
          <td>約12.5億バレル（うち4億放出）</td>
          <td>日量330万バレル/120日間</td>
          <td style="color: #ef4444; font-weight: bold;">7月上旬（放出分）</td>
        </tr>
      </tbody>
    </table>

    <p>
      <a href="https://www.kpler.com/" target="_blank" rel="noopener noreferrer">Kpler</a>（コモディティ貨物追跡・貿易データ分析の世界的大手）の分析（4/7時点）によると、市場はすでに<strong>日量約600万バレル</strong>のペースで在庫を取り崩しています。備蓄放出の限界が近づけば、このギャップは<strong>日量1,000〜1,100万バレル</strong>に拡大するリスクがあります（<a href="https://www.kpler.com/blog/iran-war-and-the-strait-of-hormuz-oil-market-implications-six-weeks-in" target="_blank" rel="noopener noreferrer">Kpler</a>）。
    </p>

    <h3>OPEC余剰生産能力 ── もう一つの限界</h3>
    <p>
      OPECの余剰生産能力は<strong>日量400〜500万バレル</strong>と推定されていますが、この数字にも注意が必要です。
    </p>
    <ul>
      <li>余剰能力の大部分はサウジアラビアとUAEに集中 ── まさに封鎖の当事国</li>
      <li>サウジは東西パイプライン経由で日量700万バレルまで出荷を増やしたが、<strong>パイプライン容量が上限</strong></li>
      <li>イラク南部の生産は封鎖開始後に<strong>70%以上減少</strong>（日量430万→130万バレル、<a href="https://en.wikipedia.org/wiki/2026_Strait_of_Hormuz_crisis" target="_blank" rel="noopener noreferrer">Wikipedia</a>）</li>
      <li>生産できても「出荷できない」── これがホルムズ封鎖の本質</li>
    </ul>

    <h3>供給ショックの3段階</h3>
    <p>
      以上の情報を統合すると、供給ショックは一度に来るのではなく、<strong>段階的に深刻化する</strong>構造が見えます。
    </p>

    <table class="article-table">
      <thead>
        <tr>
          <th>フェーズ</th>
          <th>時期</th>
          <th>状況</th>
          <th>原油価格の目安</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>1. 備蓄バッファー期</strong></td>
          <td>3月〜5月上旬</td>
          <td>IEA備蓄放出+OPEC増産+パイプライン迂回で日量3〜4百万バレルのギャップを吸収。市場は「まだ持つ」と判断</td>
          <td>$95〜115</td>
        </tr>
        <tr style="background: #fefce8;">
          <td><strong>2. 備蓄枯渇期</strong></td>
          <td style="color: #f59e0b; font-weight: bold;">5月〜7月</td>
          <td>日本等アジア主要国の放出分が枯渇（5月）。IEA放出枠の残りが急減。ギャップが日量5〜6百万バレルに拡大</td>
          <td style="color: #ef4444; font-weight: bold;">$120〜150</td>
        </tr>
        <tr style="background: #fef2f2;">
          <td><strong>3. 純供給危機</strong></td>
          <td style="color: #ef4444; font-weight: bold;">7月以降</td>
          <td>IEA/SPR放出完了。備蓄なしで需給を合わせるには<strong>需要破壊</strong>（景気後退による消費減）が必要</td>
          <td style="color: #ef4444; font-weight: bold;">$150〜200+</td>
        </tr>
      </tbody>
    </table>

    <h4>アナリストの見立て</h4>
    <table class="article-table">
      <thead>
        <tr>
          <th>機関</th>
          <th>予測</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>EIA</strong>（米エネルギー情報局）</td>
          <td>Brent 2Q26にピーク<strong>$115</strong>、4Q26に$88（封鎖の段階的緩和を前提、<a href="https://www.eia.gov/outlooks/steo/report/global_oil.php" target="_blank" rel="noopener noreferrer">STEO 4月号</a>）</td>
        </tr>
        <tr>
          <td><strong>Goldman Sachs</strong></td>
          <td>封鎖がもう1ヶ月続けばBrent年間<strong>$100超</strong>。Q3に<strong>$120</strong>（<a href="https://www.benzinga.com/analyst-stock-ratings/analyst-color/26/04/51750505/brent-to-stay-above-100-through-2026-if-hormuz-closure-drags-on-another-month-warns-goldman-sachs" target="_blank" rel="noopener noreferrer">Benzinga</a>）</td>
        </tr>
        <tr>
          <td><strong>JP Morgan</strong></td>
          <td>5月中旬まで封鎖ならBrent<strong>$150に向けてオーバーシュート</strong>（<a href="https://www.thestreet.com/economy/j-p-morgan-delivers-stark-warning-on-where-oil-prices-are-headed" target="_blank" rel="noopener noreferrer">TheStreet</a>）</td>
        </tr>
        <tr>
          <td><strong>Rystad Energy</strong></td>
          <td>2ヶ月の戦争で4月Brent<strong>$110</strong>。4ヶ月なら6月に<strong>$135</strong></td>
        </tr>
        <tr>
          <td><strong>Macquarie</strong></td>
          <td>6月まで封鎖ならBrent<strong>$200超の確率40%</strong></td>
        </tr>
        <tr>
          <td><strong>Kpler</strong></td>
          <td>需給均衡には<strong>$160〜170</strong>が必要と試算（<a href="https://www.kpler.com/blog/iran-war-and-the-strait-of-hormuz-oil-market-implications-six-weeks-in" target="_blank" rel="noopener noreferrer">Kpler</a>）</td>
        </tr>
        <tr>
          <td><strong>Onyx Capital</strong></td>
          <td>米国の海上封鎖で<strong>$150超</strong>（<a href="https://www.bloomberg.com/jp/news/articles/2026-04-13/TDF2JBT96OSG00" target="_blank" rel="noopener noreferrer">Bloomberg</a>）</td>
        </tr>
      </tbody>
    </table>

    <h3>本日（4/13）の海上封鎖宣言が変えたもの</h3>
    <p>
      トランプ大統領は4月12日、「国際水域においてイランに通行料を支払ったすべての船舶を捜索・阻止するよう米海軍に命じた」と宣言しました（<a href="https://www.nikkei.com/article/DGXZQOGN1221T0S6A410C2000000/" target="_blank" rel="noopener noreferrer">日経新聞</a>）。CENTCOMは4月13日からの封鎖実施を発表しています。
    </p>
    <p>
      これが供給ショックのタイムラインに与える影響は大きい。封鎖開始以降、一部の船舶はイランに1隻あたり約200万ドルの「通行料」を支払って海峡を通過していました（<a href="https://www.newsweekjapan.jp/stories/world/2026/03/592214.php" target="_blank" rel="noopener noreferrer">Newsweek</a>）。この「灰色の抜け道」が米国によって塞がれたことで：
    </p>
    <ul>
      <li><strong>封鎖解除シナリオが後退</strong> ── 4/12の交渉決裂+米国の対抗封鎖で、短期解決の見通しがさらに遠のいた</li>
      <li><strong>上記タイムラインの前倒しリスク</strong> ── 通行料経由で細々と流れていた原油が完全に止まれば、備蓄の取り崩しペースが加速する</li>
      <li><strong>フェーズ2への移行が早まる可能性</strong> ── 5月を待たずに「備蓄枯渇期」の兆候が出始める可能性</li>
    </ul>

    <h3>封鎖が解除される場合のシナリオ</h3>
    <p>
      すべてが悪化するわけではありません。封鎖が解除されるシナリオも整理しておきます。
    </p>
    <ul>
      <li><strong>1ヶ月以内の解除:</strong> 原油は封鎖前の$60台に急速に回帰。戦争プレミアムが剥落し、備蓄を再び積み増すフェーズに入る。EIA予測ではBrent 2027年に$76。</li>
      <li><strong>3ヶ月以内の段階的解除:</strong> 原油は$75〜85程度に緩やかに下落。備蓄の回復には時間がかかり、リスクプレミアムが残る。</li>
      <li><strong>部分的解除（非イラン港のみ再開）:</strong> CENTCOMは「非イラン港向け船舶の通航は妨げない」と明確化しており（<a href="https://www.cnn.com/2026/04/12/world/live-news/iran-us-war-talks-trump" target="_blank" rel="noopener noreferrer">CNN</a>）、この形での部分正常化が最も現実的。ただしイラン産原油は引き続き市場から消失。</li>
    </ul>

    <div style="margin-top: 30px; padding: 0; border-radius: 12px; overflow: hidden; border: 2px solid #ef4444; box-shadow: 0 4px 24px rgba(239, 68, 68, 0.15);">
      <div style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); padding: 16px 20px;">
        <p style="margin: 0; font-size: 0.75em; color: #fca5a5; font-weight: bold; letter-spacing: 0.1em;">KEY TAKEAWAY</p>
        <h3 style="margin: 4px 0 0 0; color: #ffffff; font-size: 1.2em;">供給ショックの「Xデイ」</h3>
      </div>
      <div style="padding: 0;">
        <table class="article-table" style="margin: 0; border-radius: 0;">
          <thead>
            <tr style="background: #1e293b;">
              <th style="color: #f8fafc; font-size: 1em; padding: 12px 16px;">Xデイ</th>
              <th style="color: #f8fafc; font-size: 1em; padding: 12px 16px;">時期</th>
              <th style="color: #f8fafc; font-size: 1em; padding: 12px 16px;">何が起きるか</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="font-size: 1em; padding: 14px 16px;"><strong>X1: アジア備蓄放出完了</strong></td>
              <td style="color: #ef4444; font-weight: bold; font-size: 1.1em; padding: 14px 16px; white-space: nowrap;">5月〜6月</td>
              <td style="padding: 14px 16px;">日本（第2弾20日分）・韓国等の放出分が完了。アジア市場で調達競争激化</td>
            </tr>
            <tr style="background: #fefce8;">
              <td style="font-size: 1em; padding: 14px 16px;"><strong>X2: IEA放出枠終了</strong></td>
              <td style="color: #ef4444; font-weight: bold; font-size: 1.1em; padding: 14px 16px; white-space: nowrap;">7月上旬</td>
              <td style="padding: 14px 16px;">協調備蓄放出が完了。備蓄のバッファーがなくなり、市場はリアルタイムの需給で価格が決まる</td>
            </tr>
            <tr style="background: #fef2f2;">
              <td style="font-size: 1em; padding: 14px 16px;"><strong>X3: 需要破壊ライン</strong></td>
              <td style="color: #ef4444; font-weight: bold; font-size: 1.1em; padding: 14px 16px; white-space: nowrap;">7月以降</td>
              <td style="padding: 14px 16px;">原油$150〜200+。景気後退による消費減でようやく需給が均衡する水準</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px; border-left: 4px solid #f59e0b;">
      <p style="margin: 0 0 8px 0; font-size: 0.8em; color: #f59e0b; font-weight: bold; letter-spacing: 0.05em;">NEXT ARTICLE</p>
      <p style="margin: 0 0 8px 0; font-size: 1.05em; color: #f8fafc; font-weight: bold;">オイルショックにトルコはいつまで耐えられるのか ── 2018年の悪夢再来か</p>
      <p style="margin: 0; font-size: 0.85em; color: #94a3b8;">原油輸入の大半を中東・ロシアに依存するトルコ。2018年通貨危機では47日で35%暴落した記憶が蘇る。外貨準備・経常赤字・参戦リスク ── トルコリラの耐久力を検証します。</p>
    </div>

    <div style="margin-top: 16px; padding: 14px 18px; background: #f8fafc; border-radius: 8px; text-align: center;">
      <p style="margin: 0; font-size: 0.85em; color: #475569;">供給ショックの進行を継続ウォッチしています。最新記事は<strong>ブックマーク</strong>でチェックしてください。</p>
    </div>
  `,
},
{
  id: 'turkey-oilshock-endurance-20260413',
  title: 'トルコリラ暴落の4つのトリガーと時間軸',
  share_title: 'トルコリラ暴落はいつ来るか？ 4つのトリガーを整理した',
  thumbnail_text: 'トルコリラ暴落\n4つのトリガーと時間軸',
  date: '2026/04/13',
  thumbnail: '/images/turkey-oilshock-endurance-20260413_60.png',
  tags: ['トルコリラ', 'オイルショック', 'USD/TRY', 'トルコ経済', '外貨準備', '中東情勢'],
  content: `
    <p class="intro">
      原油備蓄は5月〜7月に枯渇し、価格は$120〜200+へ。中東情勢も緊迫化するなか、<strong>トルコリラの暴落リスクが高まっています。</strong>いつ、何がトリガーになるのでしょうか？
    </p>

    <h3>トルコの体力 ── 6つの数字</h3>
    <table class="article-table">
      <thead><tr><th>指標</th><th>現在値</th><th>危険水準</th><th>判定</th></tr></thead>
      <tbody>
        <tr><td>外貨準備（ネット）</td><td style="color: #f59e0b; font-weight: bold;">約250億ドル<span style="font-size: 0.8em; color: #64748b;">（グロス約950億ドル）</span></td><td>-</td><td>脆弱</td></tr>
        <tr><td>輸入カバー月数</td><td style="color: #ef4444; font-weight: bold;">3.5ヶ月</td><td>3ヶ月以下</td><td style="color: #ef4444;">既に警戒水準</td></tr>
        <tr><td>政策金利</td><td>37%</td><td>-</td><td style="color: #f59e0b;">利上げ余地は限定的</td></tr>
        <tr><td>インフレ率</td><td style="color: #ef4444; font-weight: bold;">約40%超</td><td>-</td><td style="color: #ef4444;">実質金利はマイナス</td></tr>
        <tr><td>経常赤字/GDP</td><td style="color: #ef4444; font-weight: bold;">-4.5%</td><td>-5%以下</td><td>原油高で悪化中</td></tr>
        <tr><td>格付け</td><td style="color: #ef4444;">B+/B3（見通しネガティブ）</td><td>引き下げ</td><td>2026年3月変更済み</td></tr>
      </tbody>
    </table>
    <p>外貨準備250億ドル、輸入カバー3.5ヶ月。原油高が進めば、この体力は急速に削られます。</p>

    <h3>暴落はいつ来るか ── 3段階のタイムライン</h3>
    <p>原油高→経常赤字拡大→外貨準備の減少→通貨防衛の限界。<a href="/articles/hormuz-supply-shock-xday-20260413">供給ショック「Xデイ」</a>と重ねると、以下のシナリオが見えます（<a href="https://www.imf.org/en/publications/wp/issues/2026/02/19/optimal-exchange-rate-policy-with-oil-shocks-572706" target="_blank" rel="noopener noreferrer">IMF WP/2026</a>）。</p>
    <table class="article-table">
      <thead><tr><th>時期</th><th>原油価格</th><th>トルコの状況</th><th>リラの動き</th></tr></thead>
      <tbody>
        <tr><td><strong>〜5月上旬</strong></td><td>$95〜115</td><td>キャリーが辛うじて支える</td><td style="color: #22c55e;">安定推移</td></tr>
        <tr style="background: #fefce8;"><td><strong>5月〜7月</strong></td><td>$120〜150</td><td><strong>キャリーの魅力が消失</strong></td><td style="color: #f59e0b;">下落開始</td></tr>
        <tr style="background: #fef2f2;"><td><strong>7月以降</strong></td><td>$150〜200+</td><td>外貨準備急減。中銀が介入断念</td><td style="color: #ef4444; font-weight: bold;">急落</td></tr>
      </tbody>
    </table>
    <p>上記は緩やかな悪化経路です。以下のトリガーが発動すれば、暴落は一気に前倒しされます。</p>

    <h3>暴落を前倒しする4つのトリガー</h3>
    <h4>トリガー1：外貨準備の枯渇</h4>
    <p>ネット準備はわずか250億ドル。中銀の介入余力が尽きた時点でリラは急落します。</p>
    <h4>トリガー2：格付け引き下げ</h4>
    <p>新興国債券インデックスから除外されれば、機関投資家の機械的売却が発動します。</p>
    <h4>トリガー3：エルドアン大統領の参戦</h4>
    <p>確率10〜20%。実現すれば<strong>年率85%減価</strong>（1年で約7分の1）。</p>
    <ul>
      <li>格付け5段階引き下げ、外貨準備5ヶ月で枯渇</li>
      <li>トリガー: クルドへの米軍支援拡大、イランからの軍事支援要請、シリア北部の戦闘激化</li>
    </ul>
    <h4>トリガー4：米国の二次制裁</h4>
    <p>トルコ企業のイラン制裁回避が米OFACに認定されるリスク。過去には制裁示唆だけで<a href="#ref-2018">リラが急落した前例</a>もあります。</p>

    <div style="margin-top: 30px; padding: 0; border-radius: 12px; overflow: hidden; border: 2px solid #ef4444; box-shadow: 0 4px 24px rgba(239, 68, 68, 0.15);">
      <div style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); padding: 16px 20px;">
        <p style="margin: 0; font-size: 0.75em; color: #fca5a5; font-weight: bold; letter-spacing: 0.1em;">KEY TAKEAWAY</p>
        <h3 style="margin: 4px 0 0 0; color: #ffffff; font-size: 1.2em;">暴落リスクと時間軸</h3>
      </div>
      <div style="padding: 0;">
        <table class="article-table" style="margin: 0; border-radius: 0;">
          <thead>
            <tr style="background: #1e293b;">
              <th style="color: #f8fafc; font-size: 1em; padding: 12px 16px;">リスク要因</th>
              <th style="color: #f8fafc; font-size: 1em; padding: 12px 16px;">時間軸</th>
              <th style="color: #f8fafc; font-size: 1em; padding: 12px 16px;">影響度</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 14px 16px;">原油高→経常赤字拡大</td>
              <td style="padding: 14px 16px;">5月〜7月に顕在化</td>
              <td style="padding: 14px 16px; color: #ef4444;">キャリー消失・下落開始</td>
            </tr>
            <tr style="background: #fefce8;">
              <td style="padding: 14px 16px;">外貨準備の枯渇</td>
              <td style="padding: 14px 16px;">封鎖6ヶ月で危機水準</td>
              <td style="padding: 14px 16px; color: #ef4444;">通貨防衛の限界</td>
            </tr>
            <tr>
              <td style="padding: 14px 16px;">米国の二次制裁</td>
              <td style="padding: 14px 16px;">突発的</td>
              <td style="padding: 14px 16px; color: #ef4444;">急落トリガー</td>
            </tr>
            <tr style="background: #fef2f2;">
              <td style="padding: 14px 16px;">参戦リスク（10-20%）</td>
              <td style="padding: 14px 16px;">突発的</td>
              <td style="padding: 14px 16px; color: #ef4444; font-weight: bold;">年率85%減価</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="padding: 16px 20px; background: #fef2f2;">
        <p style="margin: 0; font-size: 0.95em;">スワップ投資はトルコの耐久力が持つ間だけ有効です。<strong>リスクの変化を監視してください。</strong></p>
      </div>
    </div>

    <div id="ref-2018" style="margin-top: 40px; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h3 style="margin-top: 0; font-size: 1em; color: #64748b;">参考：2018年の通貨危機（第一期トランプ政権）</h3>
      <p style="font-size: 0.9em;">
        2018年8月、米国人牧師ブランソンの拘束問題でトランプ大統領がトルコへの関税を倍増。<strong>リラは47日間で35%下落。</strong>8月10日には1日で10%暴落し、過去最安値7.24をつけました（<a href="https://en.wikipedia.org/wiki/Turkish_economic_crisis_(2018%E2%80%93current)" target="_blank" rel="noopener noreferrer">Wikipedia</a>）。10月のブランソン解放と625bp緊急利上げで収束。
      </p>
      <p style="font-size: 0.85em; color: #475569; margin-top: 12px;">
        2026年との違い:
      </p>
      <ul style="font-size: 0.85em; color: #475569; margin-top: 4px;">
        <li>原油高は外的ショック。トルコが自力で解決できない</li>
        <li>封鎖解除の見通しが不透明。出口が見えない</li>
        <li>参戦リスク・制裁リスクという追加リスク</li>
        <li>インフレ40%超・金利37%で利上げ余地が限定的</li>
      </ul>
      <details style="margin-top: 12px;">
        <summary style="cursor: pointer; font-size: 0.85em; color: #3b82f6; font-weight: bold;">2018年 vs 2026年 詳細比較テーブル</summary>
        <table class="article-table" style="margin-top: 12px; font-size: 0.85em;">
          <thead>
            <tr><th>指標</th><th>2018年（危機直前）</th><th>2026年（現在）</th><th>判定</th></tr>
          </thead>
          <tbody>
            <tr><td>政策金利</td><td>17.75%→24%（緊急625bp利上げ）</td><td>37%</td><td style="color: #f59e0b;">利上げ余地は限定的</td></tr>
            <tr><td>ネット外貨準備</td><td>約280億ドル</td><td>約250億ドル</td><td style="color: #ef4444;">2018年より少ない</td></tr>
            <tr><td>経常赤字/GDP</td><td>-5.5%</td><td>-4.5%（原油$95時点）</td><td style="color: #f59e0b;">悪化中</td></tr>
            <tr><td>インフレ率</td><td>約16%</td><td>約40%超</td><td style="color: #ef4444;">大幅に悪化</td></tr>
            <tr><td>ショックの性質</td><td>米国制裁（外交問題）</td><td>原油高＋制裁＋参戦リスク</td><td style="color: #ef4444;">複合的</td></tr>
            <tr><td>出口</td><td>ブランソン解放→回復</td><td>封鎖解除の見通し不透明</td><td style="color: #ef4444;">出口が見えない</td></tr>
          </tbody>
        </table>
      </details>
    </div>

    <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px; border-left: 4px solid #f59e0b;">
      <p style="margin: 0 0 8px 0; font-size: 0.8em; color: #f59e0b; font-weight: bold; letter-spacing: 0.05em;">COMPANION ARTICLE</p>
      <p style="margin: 0 0 8px 0; font-size: 1.05em; color: #f8fafc; font-weight: bold;"><a href="/articles/hormuz-supply-shock-xday-20260413" style="color: #f8fafc; text-decoration: none;">ホルムズ封鎖で供給ショックが訪れる「Xデイ」── 備蓄は7月上旬に枯渇か？</a></p>
      <p style="margin: 0; font-size: 0.85em; color: #94a3b8;">本記事の前提となる供給ショックの3段階タイムライン。備蓄放出の枯渇時期とアナリスト予測を整理しています。</p>
    </div>

    <div style="margin-top: 16px; padding: 14px 18px; background: #f8fafc; border-radius: 8px; text-align: center;">
      <p style="margin: 0; font-size: 0.85em; color: #475569;">トルコリラの耐久力を継続ウォッチしています。最新記事は<strong>ブックマーク</strong>でチェックしてください。</p>
    </div>
  `,
},
  {
    id: 'central-tanshi-abnormal-swap-20260331',
  title: 'セントラル短資の異常スワップはいつまで続く？',
  thumbnail_text: 'セントラル短資\n異常スワップ\n年率33％超え',
  date: '2026/03/31',
  thumbnail: '/images/central-tanshi-abnormal-swap-20260331_60.png',
  tags: ['FX', 'トルコリラ', 'スワップ投資', 'セントラル短資FX', '高金利通貨'],
  content: `
    <p class="intro">
      セントラル短資FXの2026年3月の実績が驚異的な数字を叩き出しています。1000万通貨の運用で、3月31日単日のスワップ損益が「33,699円」、月間のスワップ損益合計はなんと「969,214円」にも達しました。
    </p>

    <div class="article-image-container" style="text-align: center; margin: 20px 0;">
      <img src="/images/central-tanshi-screenshot-20260331.png" alt="セントラル短資FX 2026年3月実績" style="max-width: 100%; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <p style="font-size: 0.8em; color: #666; margin-top: 8px;">（セントラル短資FX 2026年3月の運用画面）</p>
    </div>

    <p>
      この実績を年率換算すると約33%になります。もしレバレッジ3倍で運用していたとすれば、年率100%近い（？！）計算になります。
    </p>

    <h3>【他社キャンペーンとの比較】</h3>
    <p>
      実は今回、SBI FXトレードの「春のスワップ20％増額キャンペーン」を紹介する予定でした。しかし、基本スワップ24円に20%を上乗せしたとしても、現在のセントラル短資の圧倒的なスワップ水準には全く及ばないため、紹介を断念せざるを得ませんでした。
    </p>

    <h3>【この異常高水準はいつまで続くのか？】</h3>
    <p>
      果たして、セントラル短資はこの異常に高いスワップ水準をこのまま継続できるのかが焦点です。
      トルコの3月政策金利は37％とほぼ限界に近い水準にあり、いずれは低下してくると予想されます。
    </p>
    <p>
      スワップが下がってくる傾向については、当ブログで毎日更新中のデータでご確認いただけます。タイミングを見計らって、改めて他社のキャンペーン情報などもお届けする予定です。
    </p>

    <div style="background: #f8fafc; padding: 20px; border-radius: 10px; margin-top: 30px; border: 1px solid #e2e8f0;">
      <p style="font-weight: bold; text-align: center; margin-bottom: 10px;">📊 最新データはブログでチェック！</p>
      <p style="text-align: center;">（この記事がよかったら、いいね♪押してください！）</p>
    </div>
  `,
},
{
  id: 'gaitame-swap-campaign-20260328-increase',
  title: '外為どっとコムの「スワップポイント最大60％増額キャンペーン」が今月も開催！10万円からでも30％上乗せのチャンス',
  thumbnail_text: '外為どっとコム\nスワップ最大60％増額\n10万円から30％上乗せ',
  date: '2026/03/28',
  thumbnail: '/images/gaitame_campaign_2604_v2.png',
  tags: ['FX', 'トルコリラ', 'スワップ投資', '高金利通貨', '外為どっとコム'],
  content: `
    <p class="intro">
      外為どっとコムにて、先月に引き続き非常にお得な<strong>「スワップポイント最大60％増額キャンペーン」</strong>が実施されます！
      今回の最大の注目ポイントも、100万円以上の入金で60％増額、10万円以上の入金でも30％増額の恩恵を受けられる点です。
      少額から参加したい方にも、しっかり利益を狙いたい方にも見逃せない内容となっています。
    </p>

    <h3>【上乗せで具体的にいくら増える？（目安の計算）】</h3>
    <p>
      公式サイトのシミュレーションによると、対象期間中に複数の通貨ペアを運用した場合、以下のようなまとまったポイント還元が期待できます。
    </p>
    <ul>
      <li><strong>入金100万円以上（60％増額）の場合：</strong> 合計で <span style="color: #ef4444; font-weight: bold;">76,995円相当</span> のポイント上乗せ！</li>
      <li><strong>入金10万円以上〜100万円未満（30％増額）の場合：</strong> 合計で <span style="color: #ef4444; font-weight: bold;">38,555円相当</span> のポイント上乗せ！</li>
    </ul>

    <p>
      また、1日・一定数量あたりの上乗せ目安（60％増額時）は以下の通り、先月よりもさらに魅力的な水準となっています。
    </p>
    <table class="article-table">
      <thead>
        <tr>
          <th>対象通貨ペア・ポジション</th>
          <th>数量</th>
          <th>1日あたりの上乗せ目安</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>トルコリラ/円（買）</td>
          <td>10万通貨</td>
          <td>約146円相当上乗せ</td>
        </tr>
        <tr>
          <td>米ドル/トルコリラ（売）</td>
          <td>1万通貨</td>
          <td>約499円相当上乗せ</td>
        </tr>
        <tr>
          <td>ユーロ/トルコリラ（売）</td>
          <td>1万通貨</td>
          <td>約683円相当上乗せ</td>
        </tr>
      </tbody>
    </table>

    <h3>【キャンペーンの概要】</h3>
    <div class="campaign-details">
      <ul>
        <li><strong>条件：</strong> 期間中の入金額（出金を引いた純増額）が10万円以上で30%増額、100万円以上で60%増額</li>
        <li><strong>対象：</strong> 『外貨ネクストネオ』でのトルコリラ/円（買）、米ドル/トルコリラ（売）、ユーロ/トルコリラ（売）の新規ポジション</li>
        <li><strong>期間：</strong> 2026年3月30日(月)午前7時00分 ～ 2026年5月2日(土)午前5時55分</li>
        <li><strong>特典：</strong> FXポイント還元（1ポイント＝1円として『らくらくFX積立』での買付に利用可能）</li>
      </ul>
      <p style="font-size: 0.9em; margin-top: 10px; border-top: 1px dashed #ccc; padding-top: 10px;">
        <strong>【適用対象ポジションLot数上限】</strong><br>
        各営業日のクローズ時点で適用対象となる数量には上限があります（入金額にかかわらず共通）。<br>
        ・トルコリラ/円：1,000Lot（100万通貨）まで<br>
        ・米ドル/トルコリラ：200Lot（20万通貨）まで<br>
        ・ユーロ/トルコリラ：200Lot（20万通貨）まで
      </p>
    </div>

    <h3>【参加するための必須条件・注意点】</h3>
    <ul>
      <li>専用フォームからの<strong>「エントリー」</strong>が必須です。入金や取引のあとでも期間内であれば有効です。</li>
      <li>特典のFXポイントを受け取るには、キャンペーン終了までに<strong>『らくらくFX積立』の口座開設</strong>を完了しておく必要があります。</li>
      <li>今回のキャンペーンは、同時開催中の「ご入金＆お取引でもれなく最大3%キャッシュバックキャンペーン」などと重複適用が可能です。</li>
    </ul>

    <p style="font-weight: bold; margin-top: 20px;">
      新興国通貨であるトルコリラは、相場の急変動などのリスクもありますが、こうした増額キャンペーンを賢く利用することで、より効率的な運用が目指せます。
      ぜひ詳細をチェックして、まずはエントリーから始めてみてください！
    </p>

    <div class="campaign-link" style="margin-top: 30px;">
      <p style="font-weight: bold; color: #2563eb;">▼キャンペーンの詳細とエントリーはこちら</p>
      <a href="https://www.gaitame.com/campaign/increase-swap-2604/" target="_blank" rel="noopener noreferrer">
        https://www.gaitame.com/campaign/increase-swap-2604/
      </a>
    </div>

    <p style="font-size: 0.8em; color: #6b7280; margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
      ※本記事は提供されたソースに基づき作成されています。投資に関する最終決定はご自身の判断で行ってください。
    </p>
  `,
},
{
  id: 'central-tanshi-high-yield-swap-20260313',
  title: '【最大4万円のチャンス！】セントラル短資FXの高金利通貨スワップ増量キャンペーンがすごい！（最大68％増）',
  thumbnail_text: 'セントラル短資FX\n高金利通貨\n最大4万円キャッシュバック',
  date: '2026/03/13',
  thumbnail: '/images/central-tanshi-high-yield-swap-20260313_60.png', // 画像用意後にパス調整
  tags: ['FX', 'メキシコペソ/円', '南アフリカランド/円', 'スワップ投資', 'キャンペーン', 'セントラル短資FX'],
  content: `
    <p class="intro">
      高金利通貨の運用に興味がある方に朗報です。現在、セントラル短資FXにて「メキシコペソ/円」と「南アランド/円」を対象とした、非常にお得なスワップポイント増量（キャッシュバック）キャンペーンが開催されています。
    </p>

    <h3>【最大4万円のチャンス】キャンペーンの全体像</h3>
    <p>
      このキャンペーンの最大の魅力は、<strong>1通貨ペアあたり最大20,000円</strong>、2通貨ペア合計で<strong>最大40,000円</strong>のキャッシュバックが狙えることです。
      日々の通常スワップポイントに「上乗せキャッシュバック」がつく形なので、スワップ投資をしている人にとっては実質的な利回りアップとなります。
    </p>

    <div class="campaign-details">
      <h4 style="margin-top: 0;">● キャッシュバックの仕組み</h4>
      <ul>
        <li>対象通貨ペア：<strong>メキシコペソ/円（MXN/JPY）</strong> と <strong>南アフリカランド/円（ZAR/JPY）</strong></li>
        <li>特典内容：日々のネット建玉数量に応じて、1日ごとにキャッシュバックを加算</li>
        <li>上限：各通貨ペアごとに最大20,000円、合計最大40,000円</li>
      </ul>
      <p>
        通常スワップに「増量分」が足されるイメージです。高金利通貨はスワップそのものが大きいため、
        キャンペーン中は<strong>実質的な受取スワップがさらに数十％増量</strong>される計算になります。
      </p>
    </div>

    <h3>【注意点】条件が少し複雑なので公式ページ要確認</h3>
    <p>
      このキャンペーンは非常にお得な一方で、<strong>条件がやや複雑</strong>です。特に注意したいポイントは次のとおりです。
    </p>
    <ul>
      <li><strong>Case1・Case2 の2パターンの還元率</strong>があり、どちらに該当するかでキャッシュバック率が変わる</li>
      <li>対象となるのは「ネット建玉数量」であり、両建てや短期売買の場合は対象数量が減る可能性がある</li>
      <li>キャンペーン期間・判定期間・付与時期がそれぞれ定められている</li>
    </ul>
    <p>
      そのため、実際に参加する前に、<strong>必ず公式ページで条件を最後まで読み切る</strong>ことをおすすめします。
      還元率のパターンや対象者の条件によっては、「思ったよりキャッシュバックが少ない」ということも起こりえます。
    </p>

    <div class="campaign-link" style="margin-top: 24px;">
      <p style="font-weight: bold; color: #2563eb;">
        ▼キャンペーンの詳しい条件・エントリーはこちら（公式ページ）
      </p>
      <a href="https://www.central-tanshifx.com/topics/2026mar2pairsswapcp/?site=mypage&cpmid=541&refer=banner"
         target="_blank" rel="noopener noreferrer">
        https://www.central-tanshifx.com/topics/2026mar2pairsswapcp/?site=mypage&cpmid=541&refer=banner
      </a>
    </div>

    <h3>【どんな人に向いているか】運用スタイル別の使い方</h3>
    <ul>
      <li>
        <strong>すでにメキシコペソ/円・南アランド/円を保有している人：</strong><br>
        既存ポジションの建玉を見直しつつ、<strong>ネット建玉をキャンペーン条件に合わせて調整</strong>することで、追加のキャッシュバックを狙えます。
      </li>
      <li>
        <strong>これから高金利通貨を始めたい人：</strong><br>
        通常スワップだけでなくキャンペーン分の上乗せも期待できるため、<strong>エントリータイミングとしては悪くない局面</strong>です。
        ただし、為替変動リスクが大きい通貨ペアなので、レバレッジは必ず控えめに。
      </li>
    </ul>

    <p style="font-weight: bold; margin-top: 20px;">
      高金利通貨は「スワップが増えれば増えるほど安全になる」という性質があります。このキャンペーンをうまく活用できれば、
      通常よりも短期間でスワップを稼ぎつつ、長期保有の安全マージンを厚くすることができます。
    </p>

    <p style="font-size: 0.9em; color: #6b7280; margin-top: 10px;">
      ※本記事は情報提供のみを目的としており、特定の金融商品の購入・売却を推奨するものではありません。
      実際の取引にあたっては、必ずご自身で最新のキャンペーン条件・リスク説明書等をご確認ください。
    </p>
  `,
},
  {
    id: 'energy-crisis-nuclear-power-20260309',
    title: 'オイルショックの足音と「動かせない原発」の正体：私たちは何を人質に取られているのか',
    thumbnail_text: 'エネルギー危機\n動かせない原発\n安全保障',
    date: '2026/03/09',
    thumbnail: '/images/energy-crisis-nuclear-power-20260309_60.png',
    tags: ['エネルギー危機', '原発', 'オイルショック', 'エネルギー安全保障', '日本の課題'],
    content: `
      <p class="intro">
        2026年3月、世界は再びエネルギー危機の淵に立たされています。イラン攻撃によるホルムズ海峡の封鎖リスク、高騰を続ける原油価格。かつてのオイルショックを彷彿とさせる光景を前に、日本の「エネルギー安全保障」が今、かつてないほど問われています。
      </p>

      <p>
        しかし、その切り札となるべき原子力発電所は、巨額の税金と歳月を投じながら、なぜ未だに稼働していないのでしょうか。
      </p>

      <h3>【巨額コストの現状】10年で6.5兆円を投じた「動かない要塞」</h3>
      <p>
        現在、日本国内の商業用原発33基のうち、新規制基準をクリアして再稼働に至っているのは約半数の15基に留まります。残りの基数は、審査中、あるいは合格しても「特重施設（テロ対策施設）」の未完成などを理由に停止したままです。
      </p>
      <p>
        この「停止」を維持するために投じられているコストは、想像を絶する規模に達しています。
      </p>

      <h4>安全対策という名の「巨大な空白」</h4>
      <ul>
        <li><strong>安全対策費の累計：約6.5兆円</strong><br>震災直後の想定（約1兆円）から6倍以上に膨張。これはウクライナが国を挙げて戦う年間の防衛予算（約10.7兆円）の半分以上に相当します。</li>
        <li><strong>特重施設のコスト：1基あたり2,000億〜5,000億円</strong><br>航空機衝突などに備える「特重施設」だけで、最新鋭イージス艦約3隻分に相当する巨費が投じられています。</li>
      </ul>

      <h3>STEP 2：【深掘り】誰が稼働を止めているのか？「規制の罠」の正体</h3>
      <p>稼働率を上げられない最大の要因は、原子力規制委員会による「審査の長期化」と、その背景にある硬直化した官僚主義にあります。</p>

      <h4>1. 因果関係のすり替え：地震か、津波か</h4>
      <p>1F（福島第一原発）の教訓は「津波による浸水」であったはずです。しかし現在の規制は、地震そのもので設備が壊れなかったという事実を無視し、過度な耐震補強を要求し続けています。</p>

      <h4>2. 「悪魔の証明」を強いる審査</h4>
      <p>「隕石の直撃」や「前例のない大規模テロ」など、天文学的な低確率の事態に対し、「絶対に起こらないこと」の証明を事業者に求める。この「悪魔の証明」が、終わりのない追加対策と審査の停滞を生んでいます。</p>

      <h4>3. 「前例」を人質に取ったコストの増大</h4>
      <p>一度どこかの電力会社が、早期の再稼働を求めて飲んだ「過酷な条件」が、自動的に全社の最低基準へ格上げされる。この「前例踏襲」が、特重施設（テロ対策施設）などの建設費を数千億円規模へと膨れ上がらせています。<br>異議を唱えれば「審査を止め、稼働を遅らせる」という人質作戦の前で、事業者は言いなりになるしかありません。</p>

      <h4>4. ブラックボックス化したテロ対策</h4>
      <p>現在の原子力規制を象徴するのは、誰が, いつ、何の合理的根拠で決めたのか不明瞭な「100メートルの離隔」や「巨大な地下要塞（特重施設）」という固定概念への固執です。</p>
      <ul>
        <li><strong>無記名のルール：</strong> 科学的な比較検討プロセスがブラックボックス化したまま、一度決まった「より厳しく」という空気が、今や動かせない「神聖なルール」と化しています。</li>
        <li><strong>技術革新の拒絶：</strong> 本来、ドローン防衛や分散配置された可搬型設備のほうが安価で機動的ですが、当局は「前例」への執着からこれらを認めません。</li>
      </ul>

      <h3>STEP 3：【未来への問い】「ゼロリスクの幻想」が国家を滅ぼす</h3>
      <p>「安全に終わりはない」という言葉は、一見正しく聞こえます。しかし、極小の地震リスクやテロリスクを排除するために、現在進行形の「オイルショックという経済的破綻」を放置することは、果たして国民のためと言えるのでしょうか。</p>

      <h4>私たちが向き合うべき3つの真実</h4>
      <ol>
        <li><strong>リスクの天秤：</strong> 100%の安全を求めるあまり、エネルギー安保を喪失するリスクを無視していないか.</li>
        <li><strong>コストの転嫁：</strong> 規制当局による「前例主義」が生んだ数兆円規模のコストは、すべて電気料金として国民に跳ね返っている.</li>
        <li><strong>合理的な規制への回帰：</strong> 科学的根拠に基づいた「現実的なリスク管理」こそが、今求められている。</li>
      </ol>

      <div class="campaign-details">
        <h3 style="margin-top: 0;">国民が支払わされる「見えない戦費」の総計</h3>
        <p>この歪んだ規制が生んでいる「コスト」は、すべて私たちの電気代として家計を直撃しています。</p>
        <p style="font-weight: bold; text-align: center; margin-bottom: 15px;">家計・月額への影響比較表</p>
        <table class="article-table">
          <thead>
            <tr>
              <th>比較対象</th>
              <th>総額（累計/年間）</th>
              <th>家計影響（月額）</th>
              <th>意味するもの</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>原発1基の停止損失</td>
              <td>約1,200億円/年</td>
              <td>約500円〜</td>
              <td>海外流出する燃料代</td>
            </tr>
            <tr>
              <td>安全対策費（累計）</td>
              <td>6.5兆円</td>
              <td>約400円</td>
              <td>10年間の設備投資償却</td>
            </tr>
            <tr>
              <td>特重施設（1基分）</td>
              <td>最大5,000億円</td>
              <td>約150円</td>
              <td>テロ対策専用施設コスト</td>
            </tr>
            <tr style="background: #fee2e2; font-weight: bold; color: #ef4444;">
              <td>合計（実害コスト）</td>
              <td>-</td>
              <td>約1,050円〜</td>
              <td>動かさない実負担</td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: 'sbi-hyper-deposit-campaign-20260306',
    title: '【先着20名】SBIハイパー預金で確実2,000円GET！特大キャンペーンも同時開催中💰',
    thumbnail_text: 'SBIハイパー預金\n確実2,000円\n年365％上乗せ',
    date: '2026/03/06',
    thumbnail: '/images/sbi-hyper-deposit-campaign-20260306_60.png',
    tags: ['SBI新生銀行', 'SBIハイパー預金', 'キャンペーン', 'ポイ活', '貯金'],
    content: `
      <p class="intro">
        こんにちは！ 現在、SBI新生銀行の「SBIハイパー預金」で、組み合わせ次第で総額1万6,000円〜2万円以上も狙える激アツなキャンペーンが開催されています。
      </p>

      <p>まずは、どなたでも確実に<strong>【現金2,000円】</strong>がもらえる私の紹介コードを公開します！</p>

      <div class="campaign-details">
        <p style="font-size: 1.2em; font-weight: bold; color: #ef4444; background: #fee2e2; padding: 10px; border-radius: 5px; text-align: center; margin-bottom: 0;">
          🔑 私の紹介コード：M104747726
        </p>
        <p style="text-align: center; font-size: 0.9em; margin-top: 5px;">（※紹介枠は最大20名まで！早い者勝ちです）</p>

        <h3>【2,000円をもらう3ステップ】</h3>
        <p>2026年3月31日（火）までに、以下の3つを完了するだけ！</p>
        <ol>
          <li><strong>SBIハイパー預金口座の開設</strong></li>
          <li><strong>エントリーフォームに紹介番号【M104747726】を入力</strong></li>
          <li><strong>SBIハイパー預金口座の残高を50,000円以上にする</strong></li>
        </ol>
      </div>

      <div class="campaign-details" style="border-color: #f59e0b; background: #fffbeb;">
        <h3 style="color: #d97706; margin-top: 0;">🚀 さらに！100万円入金でキャンペーン特典を総取り！</h3>
        <p>
          現在、「年利365％上乗せ（先着10万人）」「最大1万円が当たるおみくじ」1万6,000円以上の獲得が狙えるボーナスステージになっています！<br>
          また、SBI証券の口座をまだお持ちでない方は、口座開設と条件達成でさらに5,000円がプレゼントされます。
        </p>
      </div>

      <p>それぞれのキャンペーンは「先着順」や「エントリー必須」のものが多いため、まずは急いで詳細をチェックしてください！</p>

      <div class="campaign-link" style="margin-top: 30px;">
        <p style="font-weight: bold; color: #2563eb;">▼各種キャンペーンの詳しい条件・エントリー・口座開設はこちら▼</p>
        <a href="https://www.sbishinseibank.co.jp/campaign/sbihyper_introduce_2603/" target="_blank" rel="noopener noreferrer">https://www.sbishinseibank.co.jp/campaign/sbihyper_introduce_2603/</a>
      </div>

      <p style="font-weight: bold; margin-top: 20px;">
        新生活に向けて、お得に現金をGETできる大チャンスをお見逃しなく！
      </p>
    `,
  },
  {
    id: 'complex-tax-return-automation-20260304',
    title: 'FX20業者・株13社・仮想通貨7社…複雑すぎる投資の確定申告をAIで整理した話',
    thumbnail_text: '確定申告\n複数口座の申告\nAI\n自動化の限界点',
    date: '2026/03/04',
    thumbnail: '/images/complex-tax-return-automation-20260304_60.png',
    tags: ['確定申告', 'FX', '仮想通貨', 'Python', 'e-Tax', '投資', '自動化', 'AI', 'NotebookLM'],
    content: `
      <p class="intro">
        毎年2〜3月になると、確定申告の季節が来る。<br>
        給与所得だけであれば年末調整で終わる話だが、投資口座を複数持っていると話はまったく変わる。FXだけで20業者、株式は13社、仮想通貨は7プラットフォーム、クラウドファンディングは6社——これが私の2025年分申告の全体像だ。
      </p>

      <p>
        厄介なのは金額の多寡ではなく、<strong>税区分がバラバラだ</strong>という点にある。FXは「先物取引に係る雑所得等（申告分離課税）」、株式や外国債券は「上場株式等の譲渡所得・配当所得（申告分離課税）」、仮想通貨や外貨預金の為替差益・クラウドファンディング収入は「雑所得（総合課税）」——同じ「投資の利益」でも、税法上はまったく別物として扱われる。
      </p>
      
      <p>
        今年は「これを毎年ちゃんとやり続けるためのしくみを作ろう」と決意し、Python 20本のスクリプトとAIを組み合わせたプロジェクトを立ち上げた。その全記録を、同じような複数口座投資家の参考になればと思いまとめる。
      </p>

      <h3>今年の申告対象——規模感</h3>
      <p>まず今年の申告対象を整理すると次のようになる（金額は非公開）。</p>
      <table class="article-table">
        <thead>
          <tr>
            <th>区分</th>
            <th>税区分</th>
            <th>対象</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>FX・CFD</td>
            <td>申告分離課税（先物取引）</td>
            <td>20業者</td>
          </tr>
          <tr>
            <td>株式・投資信託</td>
            <td>申告分離課税（特定口座）</td>
            <td>13社</td>
          </tr>
          <tr>
            <td>外国債券</td>
            <td>申告分離課税 ＋ 外国税額控除</td>
            <td>1社</td>
          </tr>
          <tr>
            <td>仮想通貨</td>
            <td>総合課税（雑所得）</td>
            <td>7プラットフォーム</td>
          </tr>
          <tr>
            <td>クラウドファンディング</td>
            <td>総合課税（雑所得）</td>
            <td>6社</td>
          </tr>
          <tr>
            <td>外貨預金 為替差益</td>
            <td>総合課税（雑所得）</td>
            <td>5銀行</td>
          </tr>
          <tr>
            <td>iDeCo</td>
            <td>小規模企業共済等掛金控除</td>
            <td></td>
          </tr>
          <tr>
            <td>生命保険料控除</td>
            <td>所得控除</td>
            <td>マイナポータル連携</td>
          </tr>
          <tr>
            <td>医療費控除</td>
            <td>所得控除</td>
            <td>マイナポータル連携</td>
          </tr>
          <tr>
            <td>住宅ローン控除</td>
            <td>税額控除</td>
            <td><strong>申告不要</strong>（後述）</td>
          </tr>
        </tbody>
      </table>
      <p>これだけの口座を持っていると、「口座ごとに集計する」という発想ではいつまでたっても終わらない。できるところまでAIで自動化を試みた。</p>

      <h3>自動化の試み——3つの原則</h3>
      <p>ChatGPTと相談しながら自動化を進めたところ、結果として、主に3つのルールで整理することとなった。途中で何度も方針変更したので、来年は最初からこの方針で進めようと思う。</p>

      <h4>ルール1: 税区分ベースで処理する</h4>
      <p>FXの損益と、外貨預金の為替差益は、似ているようで税法上の区分が異なる。FXは申告分離課税（20.315%）、外貨預金の為替差益は総合課税（累進税率）だ。これを混在させると申告が誤る。フォルダ構成から処理ロジックまで、すべて税区分を基準にした。</p>

      <h4>ルール2: 特定口座の年間取引報告書は集計しない</h4>
      <p>特定口座の年間取引報告書は業者ごとにフォーマットが異なるうえ、項目が多いので、AI任せ（LLM）で集計するとミスが多すぎた。各業者が発行する「年間損益報告書」の値をそのまま手入力するか、入手できるならXML形式の年間取引報告書を使う方が正確かつ効率的だ。</p>

      <h4>ルール3: 税額断定はしない</h4>
      <p>このプロジェクトはあくまで「e-Taxへの入力値を整理するための補助ツール」であり、最終的な税額計算はe-Tax（国税庁の確定申告書等作成コーナー）に委ねる。税額の断定はせず、参考値を出力するに留める。</p>

      <h3>フォルダ設計</h3>
      <p>データは次の3層で整理した。</p>
      <div style="background-color: #f1f5f9; padding: 15px; border-radius: 5px; font-family: monospace; white-space: pre-wrap; font-size: 0.9em; margin-bottom: 20px;">
2025_tax_return/
├── raw_documents/    ← 元書類（PDF・XML・JPEG・CSV）を税区分別に保管
│   ├── futures_fx/   ← FX年間損益報告書（PDF）
│   ├── stocks/       ← 特定口座年間取引報告書（XML/PDF）
│   ├── crypto/       ← 仮想通貨取引履歴（CSV）
│   ├── forex_deposit/← 外貨預金明細（銀行別CSV）
│   ├── foreign_bond/ ← JTGブラジル国債（XML）
│   ├── ideco/        ← 払込証明書（JPEG）
│   └── ...
├── analysis/         ← 集計・分析結果（スクリプト出力）
└── summary/          ← 最終集計JSON・繰越データ
      </div>
      <p>年度ごとに <code>2025_tax_return/</code>、<code>2026_tax_return/</code> とフォルダを切り、<strong>同じ構成を毎年使い回す</strong>。スクリプト側も環境変数 <code>TAX_YEAR</code> で年度を切り替えられる設計にした。</p>

      <h3>Pythonスクリプト20本の役割分担</h3>
      <p>処理の種類に応じてスクリプトを4種類に分類した。</p>

      <h4>1. 抽出系——PDFをテキスト化する</h4>
      <p>FXの年間損益報告書はほぼPDFで届く。<code>export_fx_pdf_to_text.py</code> でテキスト化し、そのテキストをNotebookLMに読み込ませて数値を抽出する「半自動フロー」を採用した。株式の報告書も同様に <code>export_stocks_pdf_to_text.py</code> でテキスト化する。</p>

      <h4>2. 計算系——税法に沿ったロジックを実装する</h4>
      <ul>
        <li><code>calculate_crypto_gain.py</code>: 仮想通貨の損益を総平均法で計算。複数のプラットフォーム・複数の通貨を横断して取得単価を管理する。</li>
        <li><code>calculate_forex_gain.py</code>: 外貨預金の為替差益を計算。「いつ、いくらでドルを受け取り、いつ円転したか」を銀行CSVから読み取る。</li>
        <li><code>calculate_jtg_deemed_foreign_tax.py</code>: 外国債の「みなし外国税額控除」の計算補助。ブラジル国債は、現地では非課税でも租税条約により20%が課税済みとみなされる——この特殊な制度を扱うための専用スクリプト。</li>
      </ul>

      <h4>3. XML生成・修正系——e-Taxとの格闘</h4>
      <p>株式の特定口座年間取引報告書は、e-Tax共通様式（TEG204形式）のXMLで提出できる。証券会社から公式XMLを入手できない場合は <code>create_teg204_xml.py</code> でXMLを生成し、<code>fix_teg204_xml_format.py</code> で形式を修正する方法をとったが途中で断念（詳細は後述）。</p>

      <h4>4. 集計系——全税目を一覧で出力する</h4>
      <ul>
        <li><strong><code>aggregate_all_2025.py</code></strong>: 全税目の最終サマリを出力する。実行すると給与・株式・FX・雑所得・控除の一覧が表示され、e-Taxへの入力前の最終確認に使う。</li>
      </ul>

      <h3>e-Taxとの格闘実録</h3>
      
      <h4>特定口座年間取引報告書のXML化（※一番苦労しましたが、結局断念）</h4>
      <p>e-Taxに読み込ませるべくPDFの特定口座年間取引報告書をXMLに変換したところ、e-Taxから拒否された。原因を調べたが、e-Tax XMLの仕様はドキュメントが少なく、エラーコードだけが手がかりでは修正しきれなかった。</p>
      
      <p>その他のe-Taxへの入力でハマったポイントは2つ。</p>

      <h4>住宅ローン控除——「申告不要」と判明</h4>
      <p>「住宅を持っているから住宅ローン控除を申告しなければ」と当初は考えていた。ところが、<strong>昭和54年建築の物件は住宅ローン減税の対象外</strong>であることが判明。「やらなくていいことを確認する」のも立派な作業だ、と改めて感じた。</p>

      <h4>外国税額控除の入力</h4>
      <p>※みなし外国税額控除の入力は非常に特殊なので読み飛ばしてOK</p>
      <ol>
        <li><strong>外貨建て入力が必要</strong>: 相手国での課税標準は円だけでなく外貨（USD）でも入力が求められる。</li>
        <li><strong>調整国外所得金額が0だと控除額も0になる</strong>: この項目を入力するまで「外国税額控除 0円」と表示され続けた。</li>
      </ol>

      <h3>AIの使い方——NotebookLMとCursor</h3>

      <h4>NotebookLM: PDFから数値を抽出する</h4>
      <p>XML形式以外は自分でPDF等からデータ化（テキスト化）し、NotebookLMに読み込ませ、「年間損益合計はいくらか」というように自然言語で問い合わせる流れにした。</p>
      <p>各税区分ごとに専用のプロンプトテンプレートを用意した（例: <code>analysis/fx/fx_notebooklm_prompt_template.txt</code>）。ひな形に証券会社名や年度を埋めるだけで毎年使い回せる。</p>

      <h4>Cursor（AI IDE）: コードとドキュメントをペアプロ</h4>
      <p>このプロジェクトのスクリプト20本とドキュメント群は、ほぼすべてCursor（AIが統合されたコードエディタ）との対話で作成した。e-TaxのXML仕様を貼り付けて「この仕様に合わせた修正スクリプトを書いて」と指示したり、「みなし外国税額控除の控除額が0になる原因を調べて」と相談したりした。</p>
      <p>AIが一番役に立ったのは<strong>「知らない税制上の知識を即座に調べられる点」</strong>だ。みなし外国税額控除や外国税額控除限度額の計算方法など、通常は税理士に聞くような内容も含め、対話しながら理解を深めることができた。</p>

      <h4>マイナポータル連携との使い分け</h4>
      <p>生命保険料控除と医療費控除はマイナポータル連携を使った。e-Taxにマイナンバーカードでログインすると、保険会社・医療機関のデータが自動で取り込まれる。これらはスクリプトを使わず、連携で完結させた。</p>

      <h3>まとめ</h3>
      <p>このプロジェクトを通じて感じたのは、<strong>「完全自動化は目標ではない」</strong>ということだ。</p>
      <p>20業者のFX報告書から人手で数値を転記する作業は残るし、e-Taxへの最終入力も人間がやる。最終的に目指したのは次の2点だけだ。</p>
      <ul>
        <li><strong>転記ミスをゼロにする</strong>（CSVに保存してスクリプトが集計するため、手計算の桁ミスがない）</li>
        <li><strong>何がどこにあるか一目でわかる</strong>（税区分別のフォルダ構成と、各フォルダのREADMEで証憑と申告値が紐づく）</li>
      </ul>
      <p>確定申告は毎年やってくる。今年の経験とコードを来年も使い回せる形で整理したことで、来年の自分がだいぶ楽になるはずだ。<br>同じように複数の投資口座を持ち、確定申告に頭を抱えている方の参考になれば幸いだ。</p>
    `,
  },
  {
    id: 'recommended-campaigns-20260302',
    title: '【2026年3月】トルコリラ・高金利通貨のスワップ増額キャンペーンおすすめ2選',
    thumbnail_text: '3月開始！\nスワップ増額\nおすすめ2選',
    date: '2026/03/02',
    thumbnail: '/images/recommended-campaigns-20260302_60.png',
    tags: ['FX', 'トルコリラ', 'スワップ投資', 'キャンペーン', 'インヴァスト証券', 'LIGHT FX'],
    content: `
      <p class="intro">
        2026年3月2日より開始される、高金利通貨を対象とした2つの主要なスワップポイント増額キャンペーンをご紹介します。トルコリラ円などの高金利通貨を運用している方、これから始めようとしている方は必見の内容です。
      </p>

      <h3>1. インヴァスト証券（トライオートFX）：トルコリラ/円スワップ増額</h3>
      <p>
        トルコリラ/円の新規買建玉を対象に、スワップポイントが大幅に上乗せされるキャンペーンです。
      </p>
      <div class="campaign-details">
        <p><strong>開催期間：</strong> 2026年3月2日（月）取引開始 ～ 2026年3月31日（火）取引終了。</p>
        <p><strong>特典内容：</strong> 対象となる買建玉に対し、スワップポイントを50%増額（キャッシュバック金額は10万通貨あたり131円）。</p>
        <p><strong>主な条件：</strong></p>
        <ul>
          <li>キャンペーン専用フォームからの申し込み。</li>
          <li>期間中の実質入金額（入金－出金）が合計50万円以上であること。</li>
          <li>2026年2月27日時点の建玉数量と比較した、新規買建玉の増加分が対象。</li>
          <li>対象となる買建玉数量の上限は最大50万通貨。</li>
        </ul>
        <p><strong>付与時期：</strong> 2026年4月末までに口座へ入金予定。</p>
      </div>
      <div class="campaign-link">
        <p style="font-weight: bold; color: #2563eb;">▼キャンペーンの詳細とエントリーはこちら</p>
        <a href="https://www.invast.jp/triauto/campaign/fx/tryswap/202603/" target="_blank" rel="noopener noreferrer">https://www.invast.jp/triauto/campaign/fx/tryswap/202603/</a>
      </div>

      <h3>2. LIGHT FX：最大50%スワップ増額</h3>
      <p>
        人気の3通貨ペア（LIGHTペア）を対象に、毎営業日のスワップポイントに増額率を乗じた金額がプレゼントされます。
      </p>
      <div class="campaign-details">
        <p><strong>開催期間：</strong> 2026年3月2日 ～ 2026年3月31日 マーケットクローズまで。</p>
        <p><strong>対象通貨ペア：</strong> メキシコペソ/円 LIGHT、トルコリラ/円 LIGHT、南アフリカランド/円 LIGHT。<br><small>※「LIGHT」がつかない通常の通貨ペアは対象外。</small></p>
        <p><strong>特典内容：</strong> キャンペーン期間中に約定した新規買いポジションに対し、最大50%の増額分をまとめてプレゼント。</p>
        <p><strong>主な条件：</strong></p>
        <ul>
          <li>キャンペーン専用申込フォームからのエントリーが必要（取引後の申し込みも可）。</li>
          <li>建玉上限は各通貨ペアごとに30Lotまで。</li>
          <li>両建ての場合は、新規の買ポジションと売ポジションの差分が対象。</li>
        </ul>
        <p><strong>付与時期：</strong> キャンペーン終了月の翌月末までに、入出金口座へ付与。</p>
      </div>
      <div class="campaign-link">
        <p style="font-weight: bold; color: #2563eb;">▼キャンペーンの詳細とエントリーはこちら</p>
        <a href="https://lightfx.jp/campaign/swapup_202603/?utm_source=hp&utm_medium=bnr&utm_campaign=cp" target="_blank" rel="noopener noreferrer">https://lightfx.jp/campaign/swapup_202603/?utm_source=hp&utm_medium=bnr&utm_campaign=cp</a>
      </div>

      <p style="font-weight: bold; margin-top: 20px;">
        どちらのキャンペーンも期間中の「新規ポジション」が対象となっています。スワップポイントが高い今の時期、これらのキャンペーンを賢く利用して収益の最大化を狙いましょう！
      </p>
    `,
  },
  {
    id: 'youtube-market-outlook-20260301',
    title: '【地政学的リスク急騰】\n週明けの不透明な相場予想に必見のYouTube動画4選',
    thumbnail_text: '地政学リスク・原油高\n週明け相場 注目動画4選',
    date: '2026/03/01',
    thumbnail: '/images/youtube-market-outlook-20260301_60.png',
    tags: ['FX', '相場展望', 'YouTube', '地政学的リスク', '原油'],
    content: `
      <p class="intro">
        週明けの不透明な相場環境を乗り切るために、中東の地政学的リスクと市場の動向を掴む上で必見のYouTube動画を4本、厳選してご紹介します。詳細はぜひ各動画を検索してご確認ください！
      </p>





      <h3>1. 【PIVOT 公式チャンネル】</h3>
      <p>
        <strong>動画タイトル：</strong> <a href="https://www.youtube.com/watch?v=nahALdDJTTY&t=134s" target="_blank" rel="noopener noreferrer">【イラン最高指導者死亡】ホルムズ海峡事実上閉鎖でオイルショック？／イスラエルと米の攻撃はいつまで続くのか／イラン側の報復はドバイなど中東各地に／イラン体制転換はどう起こるのか／田中浩一郎氏が解説</a>
      </p>
      <p>
        <strong>見どころ：</strong> イラン最高指導者の死亡やホルムズ海峡の事実上封鎖という緊迫した中東情勢が、エネルギー供給（特にLNG）や今後の国際社会にどのような影響を及ぼすのかを専門家が解説しています。指導者不在によるイラン国内の混乱や体制転換の行方など、マクロな視点で事態を把握したい方におすすめです。
      </p>

      <h3>2. 【yenzo market】</h3>
      <p>
        <strong>動画タイトル：</strong> <a href="https://www.youtube.com/watch?v=2jnuOYTDfWc&t=9s" target="_blank" rel="noopener noreferrer">【地政学的リスクと米PPI上昇】リスクオフで米長期金利低下、株安、ドルはやや下落だがほぼ動かず</a>
      </p>
      <p>
        <strong>見どころ：</strong> 中東の地政学的リスクと米国のPPI（生産者物価指数）上昇を受けて、実際の金融市場がどう動いているかを解説しています。リスクオフによる米10年債利回りの4%割れ、テック株の下落、有事の金（ゴールド）の上昇など、資金の流れをサクッと確認できます。
      </p>

      <h3>3. 【FX初心者ch】 by ユーちぇる監督</h3>
      <p>
        <strong>動画タイトル：</strong> <a href="https://www.youtube.com/watch?v=2ioyFHQYKGE" target="_blank" rel="noopener noreferrer">【FX・株】ホルムズ海峡、閉鎖？米・イスラエルvsイランの地政学リスクをによるチャートへの影響を徹底解説します【原油・豪ドル】</a>
      </p>
      <p>
        <strong>見どころ：</strong> 月曜日の相場で一番注目すべきは「原油」のチャートであり、窓を開けて上昇する可能性が高いと解説しています。地政学リスクによる株安などのリスクオフ相場は短命に終わりやすい過去の傾向や、原油高が長期化した場合の「ドル高円安」シナリオ、さらには豪ドル（リスク通貨）の押し目買いの可能性など、実践的なトレード戦略が学べます。
      </p>

      <h3>4. オオカミ少佐のニュースチャンネル</h3>
      <p>
        <strong>動画タイトル：</strong> <a href="https://www.youtube.com/watch?v=-HjTIXLVlzY" target="_blank" rel="noopener noreferrer">【元海上自衛隊幹部が解説】難攻不落？イランの地政学</a>
      </p>
      <p>
        <strong>見どころ：</strong> 元海上自衛隊幹部が、イランが山脈や砂漠といった天然の要害に守られた「難攻不落」の国であることを解説しています。アメリカが直接的な地上軍の派遣を行えない軍事的な理由や、深刻なインフレによる市民の抗議運動を利用した内部からの体制転換シナリオなど、ニュースの裏側にある地政学のリアルを深く理解するのに最適な動画です。
      </p>
    `,
  },
  {
    id: 'gaitame-swap-campaign-20260228',
    title: '外為どっとコムの「スワップポイント最大60％増額キャンペーン」がおすすめです！',
    date: '2026/02/28',
    thumbnail: '/images/gaitame_campaign_60.png',
    tags: ['FX', 'トルコリラ', 'スワップ投資', '高金利通貨', '外為どっとコム'],
    content: `
      <p class="intro">
        外為どっとコムにて、非常にお得な「スワップポイント最大60％増額キャンペーン」が実施されます！<br>
        一番の重要なポイントは、最大の60％増額を狙うには100万円の入金が必要ですが、10万円の入金でもしっかり30％増額の恩恵を受けられるという点です。少額からでも参加しやすい内容になっています。
      </p>


      <h3>【上乗せで大体いくら増える？（目安の計算）】</h3>
      <p>複数の対象通貨ペアを1〜2週間程度運用した場合の公式シミュレーションによると、以下のようなまとまったポイントが還元されます。</p>
      <ul>
        <li><strong>入金10万円以上（30％増額）の場合：</strong> 合計で<span style="color: #ef4444; font-weight: bold;">約35,345円相当</span>のポイント上乗せ！</li>
        <li><strong>入金100万円以上（60％増額）の場合：</strong> 合計で<span style="color: #ef4444; font-weight: bold;">約70,625円相当</span>のポイント上乗せ！</li>
      </ul>

      <p>また、1日・一定数量あたりの上乗せ目安（60％増額時）は以下の通りです。</p>
      <table class="article-table">
        <thead>
          <tr>
            <th>対象通貨ペア・ポジション</th>
            <th>数量</th>
            <th>1日あたりの上乗せ目安</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>トルコリラ/円（買）</td>
            <td>10万通貨</td>
            <td>約145円相当上乗せ</td>
          </tr>
          <tr>
            <td>米ドル/トルコリラ（売）</td>
            <td>1万通貨</td>
            <td>約448円相当上乗せ</td>
          </tr>
          <tr>
            <td>ユーロ/トルコリラ（売）</td>
            <td>1万通貨</td>
            <td>約624円相当上乗せ</td>
          </tr>
        </tbody>
      </table>

      <h3>【キャンペーンの概要】</h3>
      <div class="campaign-details">
        <p><strong>条件：</strong> 期間中の入金額（出金を引いた純増額）が10万円以上で30%増額、100万円以上で60%増額</p>
        <p><strong>対象：</strong> トルコリラ/円（買）、米ドル/トルコリラ（売）、ユーロ/トルコリラ（売）の新規ポジション</p>
        <p><strong>期間：</strong> 2026年3月2日～3月28日</p>
        <p><strong>特典：</strong> FXポイント還元（「らくらくFX積立」での買付に利用可能）</p>
        <p style="font-size: 0.9em; margin-top: 10px; border-top: 1px dashed #ccc; padding-top: 10px;">
          <strong>【適用対象ポジションLot数上限】</strong><br>
          対象期間中の各営業日においてスワップポイント上乗せ金額の適用対象となるポジションのLot数には、所定の上限がございます。通貨ペア毎の上限は次の通りです。<br>
          ・トルコリラ/円（TRY/JPY）：1,000Lot（100万通貨）まで<br>
          ・米ドル/トルコリラ（USD/TRY）：200Lot（20万通貨）まで<br>
          ・ユーロ/トルコリラ（EUR/TRY）：200Lot（20万通貨）まで
        </p>
      </div>

      <h3>【参加するための必須条件・注意点】</h3>
      <ul>
        <li>専用フォームからの「エントリー」が必須です。</li>
        <li>ポイントを受け取るには、キャンペーン終了までに『らくらくFX積立』の口座開設を完了させておく必要があります。</li>
      </ul>

      <p style="font-weight: bold; margin-top: 20px;">
        100万円の資金がすぐに用意できなくても、10万円から手軽に30%の上乗せが狙える大チャンスです。ぜひこの機会にチェックして、エントリーしてみてください！
      </p>

      <div class="campaign-link" style="margin-top: 30px;">
        <p style="font-weight: bold; color: #2563eb;">▼キャンペーンの詳細とエントリーはこちら</p>
        <a href="https://www.gaitame.com/campaign/increase-swap-2603/" target="_blank" rel="noopener noreferrer">https://www.gaitame.com/campaign/increase-swap-2603/</a>
      </div>
    `,
  },
  {
    id: 'dandanbank-campaign-20260215',
    title: '【最大24,000円】DanDanBANKのキャンペーンが超おトク！',
    date: '2026/02/15',
    thumbnail: '/images/dandan_campaign_60.png',
    tags: ['DanDanBANK', 'キャンペーン', '銀行', 'ポイ活'],
    content: `
      <p class="intro">
        今、ポイ活ユーザーの間で話題なのが「DanDanBANK」の新規口座開設キャンペーンです。
      </p>


      <h3>1. もらえる特典（合計24,000円相当）</h3>
      <ul>
        <li><strong>口座開設＋10万円預け入れ：</strong> 2,000円</li>
        <li><strong>給与受取（月3万円〜）：</strong> 1,000円</li>
        <li><strong>カード新規入会＆利用：</strong> 最大21,000円相当
          <ul>
            <li>クレジットカード利用で最大11,000円相当</li>
            <li>JCBデビットカード利用で10,000円相当</li>
          </ul>
        </li>
      </ul>

      <h3>2. 銀行としての魅力</h3>
      <ul>
        <li><strong>普通預金が超高金利：</strong> 年0.40%〜最大0.90%（2026年1月時点）と業界最高水準です。</li>
        <li><strong>手数料が無料：</strong> 銀行同士の振込は何度でも無料。ATMや他行宛振込も条件次第で無料回数がつきます。</li>
      </ul>

      <h3>3. 参加のステップ</h3>
      <ol>
        <li>アプリをダウンロードして口座開設。</li>
        <li>アプリ内のバナーからキャンペーンに必ずエントリーする。</li>
        <li>5月29日（金）までに条件をクリアする。</li>
      </ol>

      <div class="campaign-link" style="margin-top: 30px;">
        <p style="font-weight: bold;">▼学生も！新社会人も！家族みんなで！ごうぎん　まるごとイイじゃん！キャンペーン</p>
        <a href="https://www.gogin.co.jp/campaign/" target="_blank" rel="noopener noreferrer">https://www.gogin.co.jp/campaign/</a>
      </div>

      <h4 style="margin-top: 20px;">＜併用可能なキャンペーン＞</h4>
      <div class="campaign-link">
        <p>▼VISAブランドのクレジットカード 新規入会＆ご利用で最大1万円キャッシュバック＋Vポイントギフトプレゼントキャンペーン</p>
        <a href="https://www3.vpass.ne.jp/mem/cardinfo/" target="_blank" rel="noopener noreferrer">https://www3.vpass.ne.jp/mem/cardinfo/</a>
      </div>
      <div class="campaign-link">
        <p>▼1万円相当のポイントがあたる！キャンペーン</p>
        <a href="https://www.gogin.co.jp/campaign/" target="_blank" rel="noopener noreferrer">https://www.gogin.co.jp/campaign/</a>
      </div>
    `,
  },
  {
    id: 'takaichi-yen-weakness-prediction-20260211',
    title: '【予測】高市政権の大勝で「円安」が再加速する理由と時期',
    date: '2026/02/11',
    thumbnail: '/images/takaichi_yen_60.png',
    tags: ['FX', '円安', '高市政権', '経済予測'],
    content: `
      <p class="intro">
        選挙後の「円高」は一時的な調整に過ぎず、中長期では「積極財政×利上げ抑制」のポリシーミックスが強烈な円安圧力を生むことが懸念されます。
      </p>


      <h3>なぜ今、円安トレンドへの回帰が予測されるのか？</h3>
      <p>
        衆議院選挙（2026年2月）での自民党大勝を受け、マーケットは「政治の安定」を好感して一旦は円高・株高で反応しました。しかし、投資家の関心はすでに「第2次高市政権がもたらす副作用」へと移っています。
      </p>
      <p>
        高市首相が掲げる「責任ある積極財政」は、本来なら金利上昇（円高）を招くはずですが、政権が景気への配慮から「利上げ」を強く牽制することで、世界でも稀な「金利を上げられない国・日本」という構図が鮮明になりつつあるからです。
      </p>

      <h3>円安を一段と進める「3つの構造的要因」</h3>

      <h4>① 政治による「利上げ抑制」の圧力</h4>
      <p>
        積極財政を支えるには、政府の借金コストを抑える必要があります。政府が日銀に対し、早期の利上げを控えるよう暗に圧力をかければ、日米の金利差は縮まらず、投機的な「円売り」に拍車がかかります。
      </p>

      <h4>② 3月の重要イベント（人事と外交）</h4>
      <p>
        直近の注目は、3月の日銀審議委員の人事交代です。ここで緩和派（リフレ派）が起用されれば、「日銀の独立性低下」と見なされ、円売り材料となります。また、トランプ米大統領への「防衛費増」などの手土産約束は、外貨需要（円売り・ドル買い）を直接的に増やす要因となります。
      </p>

      <h4>③ 巨額の利払い負担という「詰み」の状態</h4>
      <p>
        長期金利が1%上昇するだけで、国の利払い費は数兆円単位で膨れ上がります。これを避けるために日銀が指値オペなどで金利を低く抑え込めば、通貨としての「円」の価値は毀損し、強烈な円安（キャピタル・フライトのリスク）を招くことになります。
      </p>

      <h3>円安はいつ、どこまで進むのか？</h3>
      <p>
        今後のターニングポイントは、予算編成と日銀会合が重なる2026年3月下旬です。
      </p>
      <ul>
        <li><strong>短期（〜3月）：</strong> 選挙の余韻による乱高下が続く。</li>
        <li><strong>中長期（4月以降）：</strong> 積極財政の具体策（消費税ゼロ政策の進展など）が見えてくるにつれ、財政悪化懸念から「悪い円安」が定着するリスク。</li>
      </ul>

      <p>
        「積極財政」と「利上げ抑制」の組み合わせは、株価にはプラスに働く側面もありますが、円安による輸入物価の上昇を通じて国民生活にコスト増を強いることになるのではないでしょうか。
      </p>
    `,
  },
  {
    id: 'min-fx-swap-campaign-20260203',
    title: 'みんなのFX：スワップNo.1チャレンジキャンペーンの凄さを徹底解説',
    date: '2026/02/03',
    thumbnail: '/images/minfx_campaign_60.png',
    tags: ['FX', 'トルコリラ', 'スワップ投資', 'みんなのFX'],
    content: `
      <p class="intro">
        トルコリラ/円のスワップポイントランキングでも常に上位を占めている「みんなのFX」。実は、キャンペーンを含めると実質的にはランキング1位の状態が続いています。
      </p>


      <h3><a href="https://min-fx.jp/campaign/swapno1_202601/?utm_source=hp&utm_medium=bnr&utm_campaign=cp" target="_blank" rel="noopener noreferrer">みんなのFX：スワップNo.1チャレンジキャンペーン</a></h3>
      
      <div class="campaign-details">
        <h4>● 他社との差額を全額キャッシュバック</h4>
        <p>対象通貨ペアのスワップポイントが他社より1円でも低い場合、その差額を後日まとめてプレゼントされます。</p>
        
        <h4>● 実質No.1の状態が維持</h4>
        <p>このキャンペーンはほぼ継続的に実施されており、長期的に「実質No.1」の状態が維持されています。高いスワップを求めて頻繁に口座を乗り換える手間がかかりません。</p>

        <p style="font-weight: bold; margin-top: 20px; color: #ef4444;">【留意点】</p>
        <ul>
          <li><strong>要申込：</strong>専用フォームからの申し込みが必須です。</li>
          <li><strong>対象取引：</strong>新規買ポジションが対象で、各通貨200Lotの上限があります。</li>
        </ul>
        <p>
          これらの点に留意すれば、スワップ投資において他に選択肢はないと言っても過言ではないほど強力なキャンペーンです。
        </p>
      </div>
    `,
  },
  {
    id: 'triauto-campaign-20260202',
    title: 'トライオートFX：トルコリラ/円 キャンペーン概要',
    date: '2026/02/02',
    thumbnail: '/images/triauto_campaign_60.png',
    tags: ['FX', 'トルコリラ', 'スワップ投資', 'トライオートFX'],
    content: `
      <p class="intro">
        トライオートFXにて、トルコリラ/円を対象とした非常に魅力的なキャンペーンが開催されています。
      </p>


      <h3><a href="https://www.invast.jp/triauto/campaign/fx/tryswap/202602/" target="_blank" rel="noopener noreferrer">トライオートFX：トルコリラ/円 キャンペーン</a></h3>
      <p class="campaign-title" style="color: #ef4444; font-weight: bold; font-size: 1.1em;">かなりおススメのキャンペーンです。</p>

      <div class="campaign-details">
        <p><strong>開催期間：</strong> 2026年2月2日（月）～ 2026年2月27日（金）</p>
        <p><strong>対象者：</strong> キャンペーンに申し込みをしたすべてのお客様</p>
        <p><strong>特典内容：</strong> 
          <ul>
            <li><strong>特典1：取引キャッシュバック</strong> 期間中の新規約定1万通貨ごとに60円をキャッシュバック（数量上限は100万通貨）。</li>
            <li><strong>特典2：スワップポイント増額</strong> 期間中に新規で建てた買い建玉の増加分を対象に、スワップポイントを60%上乗せしてキャッシュバック（対象建玉の上限は100万通貨）。</li>
          </ul>
        </p>
        <p><strong>特典の付与時期：</strong> 2026年3月末までにトライオートFX口座へ入金。</p>
        <p><strong>注意事項：</strong> 
          <ul>
            <li>キャンペーンへの申し込みが必要です。</li>
            <li>新規口座開設キャンペーンとの併用は不可となっており、両方に申し込んだ場合は本キャンペーンが優先されます。</li>
          </ul>
        </p>
      </div>
    `,
  },
  {
    id: 'feb-swap-campaigns-20260130',
    title: '2月開始スワップポイント増額キャンペーンまとめ（外為、SBI、セントラル短資FX）',
    date: '2026/01/30',
    thumbnail: '/images/feb_campaigns_60.png',
    tags: ['FX', 'トルコリラ', 'スワップ投資', 'キャンペーンまとめ'],
    content: `
      <p class="intro">
        2月からスタートする注目のスワップポイント増額キャンペーンをまとめました。各社とも非常に魅力的な内容となっています。
      </p>


      <h3>1. <a href="https://www.gaitame.com/campaign/" target="_blank" rel="noopener noreferrer">外為どっとコム：最大40％増額キャンペーン</a></h3>
      <p class="campaign-title" style="color: #ef4444; font-weight: bold; font-size: 1.1em;">最高におススメのキャンペーンです。</p>
      <p>
        全通貨よいですが、米ドル/トルコリラ（USD/TRY）は今月の円高でもスワップ込みで＋になるなど、
        あまり為替の影響を受けないので、比較的安心して投資できます。
      </p>
      
      <div class="campaign-details">
        <p><strong>特典：</strong> 対象通貨ペアの新規ポジションに対し、スワップポイントを最大40％増額（FXポイントとして付与）。</p>
        <p><strong>対象通貨ペア：</strong> トルコリラ/円、ユーロ/トルコリラ（各40％）、米ドル/トルコリラ（30％）。</p>
        <p><strong>Lot数上限：</strong></p>
        <ul>
          <li>トルコリラ/円（TRY/JPY）：500Lot（50万通貨）まで</li>
          <li>米ドル/トルコリラ（USD/TRY）：100Lot（10万通貨）まで</li>
          <li>ユーロ/トルコリラ（EUR/TRY）：100Lot（10万通貨）まで</li>
        </ul>
        <p><strong>期間：</strong> 2026年2月2日 ～ 2月28日。</p>
        <p><strong>主な条件：</strong> エントリー、期間中に10万円以上の入金（純増額）、『らくらくFX積立』口座の開設が必要です。</p>
        <p><strong>還元時期：</strong> 2026年3月末までに積立口座へ付与。</p>
      </div>

      <h3>2. <a href="https://www.sbifxt.co.jp/campaign/" target="_blank" rel="noopener noreferrer">SBI FXトレード：最大30％UP(トルコリラは20％)キャンペーン</a></h3>
      <p class="campaign-title" style="color: #ef4444; font-weight: bold; font-size: 1.1em;">最高におススメのキャンペーンです。</p>
      <p>
        これまでどおりなら、約６００万＋α程度の新規建てで最大20万円（スワップポイント１００万円）となり、最も効率的です。
      </p>
      
      <div class="campaign-details">
        <p><strong>特典：</strong> 対象通貨ペアの新規ポジションに対し、受取スワップを最大30％上乗せキャッシュバック。</p>
        <p><strong>対象通貨ペア：</strong> 南アフリカランド/円、トルコリラ/円、メキシコペソ/円。</p>
        <p><strong>期間：</strong> 2026年2月2日 ～ 4月1日。</p>
        <p><strong>主な条件：</strong> エントリーが必要で、キャッシュバック上限は各通貨ペアにつき20万円です。</p>
        <p><strong>還元時期：</strong> 2026年4月末を目途にFX口座へ入金。</p>
      </div>

      <h3>3. <a href="https://www.central-tanshifx.com/campaign/" target="_blank" rel="noopener noreferrer">セントラル短資FX：スワップポイント増量キャンペーン</a></h3>
      <p class="campaign-title" style="color: #ef4444; font-weight: bold; font-size: 1.1em;">最高におススメのキャンペーンです。</p>
      <p>
        そもそものスワップポイントがセントラル短資は非常に高い上に追加分があるので、最大４万円と総額は小さいですが、トータルでお得です。
        なお、本来トルコリラ円しかおススメしないんですが、今回ばかりはメキシコペソ/円の増量が80%なので、こちらでゲットするのもよいかもしれません。
      </p>
      
      <div class="campaign-details">
        <p><strong>特典：</strong> 期間中に新規約定した対象通貨ペアの建玉1万通貨ごとに、最大で1日10円キャッシュバック。</p>
        <p><strong>対象通貨ペア：</strong> トルコリラ/円、メキシコペソ/円、南アフリカランド/円。</p>
        <p><strong>期間：</strong> 2026年2月2日 ～ 2月27日。</p>
        <p><strong>主な条件：</strong> エントリーが必要です。「入金条件」を達成した場合は1万通貨あたり1日10円、達成していない場合は5円となります。</p>
        <p><strong>入金条件：</strong> 期間中の日本円での入出金差額が100万円以上の日が10営業日以上あること（詳細はキャンペーンページをご確認ください。）</p>
        <p><strong>キャッシュバック上限：</strong> 入金条件達成時：最大合計4万円、非達成時：最大合計2万円（上限100万通貨分まで）。</p>
      </div>
    `,
  },
  {
    id: 'dollar-depreciation-20260129',
    title: '米国の為替政策と円高の陰で進むドル安',
    date: '2026/01/29',
    thumbnail: '/images/dollar-depreciation-20260129_60.png',
    tags: ['FX', 'ドル安', '為替政策', 'トランプ政権'],
    content: `
      <p class="intro">
        昨今の為替市場では円高の動きが注目されていますが、その背景には、単なる日本円の独歩高ではなく、トランプ大統領やベッセント次期財務長官の発言を巡る「ドルの不信感」と、それに伴う「資産インフレ」の予兆が隠されています。
      </p>

      <h3>1. ベッセント発言と「強いドル政策」の真意</h3>
      <p>
        ベッセント財務長官は最近、CNBCのインタビューで「介入は絶対にしない」「常に非常に強いドル政策を維持してきた」と発言しました。
      </p>
      <p>
        ベッセント氏が掲げる「強いドル政策」とは、「下落するにしても秩序だって緩やかであること」は許容しつつ、米国への投資が途絶えたり、資金が海外へ流出したりすることを警戒していると思われます。
      </p>

      <h3>2. タカ派のFOMCでも止まらないドル安</h3>
      <p>
        1月29日のFOMC（米連邦公開市場委員会）では、経済活動の評価が「緩やか」から「堅調」へと引き上げられ、雇用も安定しているとの認識が示されました。これを受け、一部では追加の利下げが行われない可能性も浮上し、内容としてはややタカ派的（金利上昇要因）でした。
      </p>
      <p>
        しかし、マーケットの反応は対照的で、パウエル議長の発言を受けてドルは下落し、ドルインデックスも急落しました。ドル・スイスが1日で2%下落するなど、ドル独歩安の様相を呈しています。これは、市場がパウエル氏の発言をそれほどタカ派的とは受け取らなかったか、あるいは金利動向以上に「ドルという通貨そのもの」への売り圧力が強まっている可能性を示唆しています。
      </p>

      <h3>3. 「現金への不信」が生む資産インフレ</h3>
      <p>
        ドル安が進む一方で、顕著な動きを見せているのが現物資産や株式への資金流入です。
      </p>
      <ul>
        <li><strong>歴史的なゴールド（金）の急騰:</strong> 金価格は一時5,300ドル、さらに5,400ドルへと一気に上昇しました。朝方に5,200ドルだった価格が1日で200ドルも跳ね上がるのは異常な事態です。これは地政学的リスクのみならず、「キャッシュ（現金）に対する不信感」から、投資家がドルを手放して現物資産に逃避している（キャッシュ・インフレ）という側面が強いと考えられます。</li>
      </ul>

      <h3>4. 日本市場への波及と今後の展望</h3>
      <p>
        日本国内でも、こうしたグローバルな流れは無視できません。一時は日本の長期金利上昇が米国債の売りを誘発する懸念から、ベッセント氏が日本をサポートするような動きも見せましたが、依然として金利上昇への警戒は続いています。
      </p>

      <h3>まとめ</h3>
      <p>
        「円高」という現象の裏側で、米国政治の不透明感や現金の価値低下を背景とした「ドル離れ」と「資産価格の暴騰」が同時進行しています。投資家は、為替の表面的な動きだけでなく、ゴールドや株式市場に現れている「通貨価値の変容」に注視する必要があります。
      </p>
    `,
  },
  {
    id: 'yen-appreciation-factors-20260128',
    title: '【速報】円高153円台突入！日米協調介入の予兆と構造的円高要因を徹底解説',
    date: '2026/01/28',
    thumbnail: '/images/yen-appreciation-factors-20260128_60.png',
    tags: ['FX', '円高', '為替介入', '経済速報'],
    content: `
      <div class="infographic-box">
        <h3 style="text-align: center; margin-bottom: 20px;">📊 円高進行 速報まとめ</h3>
        <table class="article-table">
          <thead>
            <tr>
              <th>項目</th>
              <th>内容</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>現在の水準</strong></td>
              <td>一時153円台（約2ヶ月半ぶりの円高水準）</td>
            </tr>
            <tr>
              <td><strong>トリガー</strong></td>
              <td>財務大臣の口先介入 ＋ 日銀・NY連銀による「レートチェック」</td>
            </tr>
            <tr>
              <td><strong>注目ポイント</strong></td>
              <td>28年ぶりの日米協調介入のサインか？</td>
            </tr>
            <tr>
              <td><strong>懸念材料</strong></td>
              <td>対米投資（約80兆円）による外貨準備減少リスク</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>1. 円高の進捗状況</h3>
      <p class="intro">2026年1月下旬、為替相場は政府・日銀による介入警戒感から急落し、一時153円台と約2ヶ月半ぶりの円高水準を記録しました。これは投資家にとって、ポジション管理の見直しが必要なタイミングとなっています。</p>

      <h3>2. 介入の予兆と円高の根拠</h3>
      <p>今回の円高のトリガーは、<span style="color: #ef4444; font-weight: bold;">財務大臣による強い口先介入</span>に加え、日銀とニューヨーク連銀が同時に実施したとされる「レートチェック」です。これは<strong>28年ぶりの日米協調介入のサイン</strong>と目されています。</p>

      <h3>3. 構造的に円高が進む4つの根拠</h3>
      <p>今回の円高は一時的なものではなく、構造的な要因に支えられている可能性があります。</p>

      <table class="article-table">
        <thead>
          <tr>
            <th>要因</th>
            <th>詳細</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>① 実質実効為替レートの回帰</strong></td>
            <td>50年ぶりの円安水準からの修正局面。歴史的に見て、極端な乖離は必ず修正される傾向がある。</td>
          </tr>
          <tr>
            <td><strong>② 所得収支の円還流</strong></td>
            <td>年間約30兆円の黒字による実需の円買い。海外投資からの配当・利子収入が円高圧力に。</td>
          </tr>
          <tr>
            <td><strong>③ 日米金利差の縮小</strong></td>
            <td>米FRBの利下げと日銀の利上げにより、金利差が縮小傾向。円キャリー取引の魅力が低下。</td>
          </tr>
          <tr>
            <td><strong>④ エネルギー貿易の改善</strong></td>
            <td>国内のエネルギー開発進展により、エネルギー輸入に伴う円売り圧力が低下。</td>
          </tr>
        </tbody>
      </table>

      <h3>4. 今後の懸念と投資戦略</h3>
      <p>円高が進む一方で、<span style="color: #f59e0b; font-weight: bold;">トランプ政権との合意による巨額の対米投資（約80兆円）</span>により、将来的に介入に使える外貨準備が大幅に減少する懸念も指摘されています。</p>
      
      <p>実際に介入を行わないとすると、どこまで円高が進むのか、市場と政府の駆け引き次第で不透明な状況となっています。</p>

      <h4>トルコリラ投資家への影響</h4>
      <ul>
        <li><strong>短期的リスク：</strong> ドル円の急変動はリスクオフの流れを加速させ、トルコリラ/円にも連れ安の可能性。</li>
        <li><strong>中長期的メリット：</strong> 円高が定着すれば、より有利なレートでトルコリラを買い増しできるチャンス。</li>
        <li><strong>スワップ収益：</strong> 円建てでのスワップポイント自体は為替レートに関係なく安定。</li>
      </ul>

      <p style="font-weight: bold; margin-top: 30px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b;">
        ⚠️ <strong>投資家の皆様へ：</strong> 当面は円高・円安両方向への急変動リスクを警戒しつつ、レバレッジを控えめに設定することをお勧めします。特に介入実施時には、数円単位の急変動が起こりうるため、証拠金維持率に十分な余裕を持たせておきましょう。
      </p>
    `,
  },
  {
    id: 'usdjpy-rate-check-20260124',
    title: 'ドル円（トルコリラ円）急落！為替介入か？今後の可能性は？',
    date: '2026/01/24',
    thumbnail: '/images/usdjpy-rate-check-20260124_60.png',
    tags: ['FX', 'ドル円', 'トルコリラ', '為替介入'],
    content: `
      <div class="infographic-box">
        <h3 style="text-align: center; margin-bottom: 20px;">📊 為替相場 速報まとめ</h3>
        <table class="article-table">
          <thead>
            <tr>
              <th>項目</th>
              <th>内容</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>発生事象</strong></td>
              <td>日銀・NY連銀による「レートチェック」報道</td>
            </tr>
            <tr>
              <td><strong>動き</strong></td>
              <td>ドル円 157円台後半 ➔ 155円台へ急落</td>
            </tr>
            <tr>
              <td><strong>意味</strong></td>
              <td>単独介入ではなく「日米協調」の姿勢を示唆<br>米国もドル高・円安を懸念している可能性大</td>
            </tr>
            <tr>
              <td><strong>警戒</strong></td>
              <td>「口先」から「実弾」への移行リスク警戒</td>
            </tr>
            <tr>
              <td><strong>注目レベル</strong></td>
              <td>サポートライン：154.75円 〜 155.10円付近</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3>1. 何が起きたのか？</h3>
      <p class="intro">ニューヨーク連銀と日銀による「レートチェック」が行われたとの報道を受け、ドル円は一時157円台から155円台まで急落しました。今回の動きは実弾介入（実際の円買い）ではないと見られますが、日米当局が協調してチェックを行った事実は、米国も現在の円安・ドル高を懸念しているという強いシグナルになります。</p>

      <h3>2. レートチェックとは？</h3>
      <p>レートチェックとは、中央銀行が為替市場の実勢レートを金融機関に問い合わせる行為です。これ自体は直接的な介入ではありませんが、市場に対して「当局が相場を注視している」という強烈なメッセージとなります。</p>
      <ul>
        <li><strong>口先介入の一種：</strong> 実際に資金を投入しないため、コストはゼロ。しかし心理的効果は絶大。</li>
        <li><strong>実弾介入の前兆：</strong> 過去の事例では、レートチェック後に実際の介入が行われるケースも多い。</li>
      </ul>

      <h3>3. 今回の特徴：「日米協調」という新技</h3>
      <p>今回最も注目すべきは、<span style="color: #ef4444; font-weight: bold;">日銀単独ではなく、ニューヨーク連銀も同時にレートチェックを実施した</span>という点です。これは以下のことを示唆しています：</p>
      <ul>
        <li><strong>米国も円安・ドル高を問題視：</strong> 従来、米国は「強いドル」を歓迎する傾向がありましたが、今回の協調行動は、過度なドル高が米国経済にも悪影響を及ぼす可能性を懸念していることを示しています。</li>
        <li><strong>介入のハードルが下がる：</strong> 日米協調であれば、日本単独での介入よりも市場への影響力が大きく、かつ政治的な正当性も高まります。</li>
      </ul>

      <h3>4. 市場への影響と今後の展開</h3>
      <p>これにより市場は安易な円売りを仕掛けにくくなり、今後は単独介入や委託介入など、さらなる実力行使への警戒感が高まるでしょう。</p>

      <h4>テクニカル分析：注目のサポートライン</h4>
      <p>テクニカル的には75日線やマンスリーピボットが位置する<strong>154円後半から155円近辺</strong>がサポートとして機能するかが焦点となります。</p>
      <ul>
        <li><strong>154.75円〜155.10円：</strong> 重要なサポートゾーン。ここを割り込むと153円台への下落も視野に。</li>
        <li><strong>157円台回復：</strong> 当面は困難。レートチェックの心理的効果が残る間は上値が重い展開が予想される。</li>
      </ul>

      <h3>5. トルコリラ投資家への影響</h3>
      <p>ドル円の急落は、リスクオフの流れを加速させ、新興国通貨であるトルコリラにも売り圧力がかかる可能性があります。</p>
      <ul>
        <li><strong>短期的：</strong> ドル円の不安定化により、トルコリラ/円も連れ安のリスク。</li>
        <li><strong>中長期的：</strong> 円高が進めば、相対的にトルコリラ/円のスワップポイントの魅力が増す可能性も。</li>
      </ul>

      <h3>6. まとめ：新たな「日米協調レートチェック」という技</h3>
      <p>新たな「日米協調レートチェック」という技が確認されたことで、相場は一層混沌とする可能性があります。今後の展開としては：</p>
      <ol>
        <li><strong>レートチェックの継続：</strong> 定期的なチェックにより、相場を一定レンジ内に抑え込む戦略。</li>
        <li><strong>実弾介入への移行：</strong> レートチェックで効果が薄れた場合、実際の円買い介入に踏み切る可能性。</li>
        <li><strong>政策金利の変更：</strong> 日銀の追加利上げや、米FRBの利下げ加速など、金融政策での対応。</li>
      </ol>

      <p style="font-weight: bold; margin-top: 30px; padding: 15px; background-color: #fef3c7; border-left: 4px solid #f59e0b;">
        ⚠️ <strong>投資家の皆様へ：</strong> 当面は「口先」から「実弾」への移行リスクを警戒しつつ、ポジション管理を慎重に行うことをお勧めします。特にレバレッジを高めに設定している方は、急激な変動に備えて証拠金の余裕を確保しておきましょう。
      </p>
    `,
  },
  {
    id: 'central-tanshi-campaign-20260116',
    title: '【1/16〜1/30限定】セントラル短資FX「トルコリラ祭り」開催中！',
    date: '2026/01/16',
    thumbnail: '/images/central-tanshi-campaign-20260116_60.png',
    tags: ['FX', 'トルコリラ', 'スワップ投資', 'セントラル短資FX'],
    content: `
      <p class="intro">本日スタート！セントラル短資FXにて、トルコリラ/円の取引で最大3万円＋αのキャッシュバックが受け取れる激熱キャンペーン「トルコリラ祭り」が開催されています。</p>

      <h3>1. キャンペーン概要</h3>
      <p><strong>期間：</strong> 2026年1月16日(金) 〜 1月30日(金)</p>
      <p>期間中の「トルコリラ/円」新規買付数量（上限100万通貨）に応じて、1万通貨ごとに以下の金額がキャッシュバックされます。</p>

      <table class="article-table">
        <thead>
          <tr>
            <th>条件</th>
            <th>特典（1万通貨あたり）</th>
            <th>最大キャッシュバック額</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>期間中に100万円以上入金</td>
            <td><strong>20円</strong></td>
            <td><strong>最大 30,000円</strong><br><span style="font-size: 0.9em; color: #ef4444;">(通常比 68%増量相当！)</span></td>
          </tr>
          <tr>
            <td>入金なし（または100万円未満）</td>
            <td>10円</td>
            <td>最大 15,000円</td>
          </tr>
        </tbody>
      </table>
      <p>※ 対象となるのは「新規買」のみです。売建は対象外となります。<br>※ 詳細は必ず<a href="https://www.central-tanshifx.com/campaign/" target="_blank" rel="noopener noreferrer">セントラル短資FX キャンペーンページ</a>をご確認ください。</p>

      <p style="font-weight: bold; font-size: 1.2em; color: #ef4444; margin-top: 30px;">激熱キャンペーンだと思います。今すぐ応募しよう！</p>
    `,
  },
  {
    id: 'fx-account-points-20260111',
    title: '【2026年最新】ポイントサイト経由でFX口座を開設して賢く稼ぐ裏ワザ',
    date: '2026/01/11',
    thumbnail: '/images/fx-account-points-20260111_60.png',
    tags: ['FX', 'ポイントサイト', '口座開設', '裏ワザ'],
    content: `
      <p class="intro">FXを始める際、公式サイトから直接申し込むのは非常にもったいないことをご存知でしょうか？ポイントサイトを経由するだけで、数万円相当のポイントが還元されます。</p>

      <h3>1. FX口座開設におすすめのポイントサイト3選</h3>
      <p>2026年1月現在、FX案件の還元率が高く、信頼性の高い3サイトを厳選しました。還元率だけでなく、私の経験上、案件の承認がスムーズで、否認された場合でもきちんと対応してくれたサイトです。</p>

      <table class="article-table">
        <thead>
          <tr>
            <th>ポイントサイト</th>
            <th>特徴・こんな人におすすめ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><a href="https://www.amefri.net/" target="_blank" rel="noopener noreferrer">アメフリ (Amefuri)</a></td>
            <td>「ログインするだけ」や「無料ガチャ」でポイントが貯まる独自施策が豊富。FX案件の限定タイムセールが強力。</td>
          </tr>
          <tr>
            <td><a href="https://pc.moppy.jp/" target="_blank" rel="noopener noreferrer">モッピー (moppy)</a></td>
            <td>会員数1,000万人超の国内最大手。FX案件の還元額が非常に高く、JAL/ANAマイルへの交換効率も良い。</td>
          </tr>
          <tr>
            <td><a href="https://hapitas.jp/" target="_blank" rel="noopener noreferrer">ハピタス (Hapitas)</a></td>
            <td>運営実績が長く、サポート体制が充実。確実に、かつ安心してポイントを受け取りたい方。</td>
          </tr>
        </tbody>
      </table>

      <h4>【「<a href="https://dokotoku.jp/" target="_blank" rel="noopener noreferrer">どこ得</a>」を活用して、ポイントサイトを使い分ける。】</h4>
      <p>「<a href="https://dokotoku.jp/" target="_blank" rel="noopener noreferrer">どこ得</a>」は、各ポイントサイトの報酬額を一括検索できる無料の比較サイトです。<br>
      使い方は簡単： 検索窓に「SBI FXトレード」や「外為どっとコム」と入力するだけ。<br>
      多くのポイントサイトの中で、「今、どこで申し込むのが最高額か」がすぐにわかります。</p>

      <p><a href="https://dokotoku.jp/" target="_blank" rel="noopener noreferrer">「どこ得で検索してみる」</a><br>
      ※申し込み直前に「どこ得」でチェックするだけで、FX案件は時期によって数千円〜1万円以上の差が出ます。</p>

      <h3>2. ポイント獲得のための注意点</h3>
      <p>ポイントサイトの報酬は高額ですが、正しく手続きしないと無効になる場合があります。</p>
      <ul>
        <li><strong>「口座開設＋取引」が必須：</strong> 多くの案件は「新規口座開設完了」に加え、「○日以内に合計○万通貨以上の取引」が条件です。<br>例： SBI FXトレードなら「口座開設＋合計10万通貨以上の取引」など。</li>
        <li><strong>スマホの「サイト越えトラッキング」設定を確認：</strong> iPhoneユーザーは特に注意が必要です。設定 ＞ Safari ＞ サイト越えトラッキングを防ぐ をオフにしてから申し込まないと、ポイントサイト経由のデータが届かず無効になります。</li>
        <li><strong>ブラウザの「戻る」ボタンは使わない：</strong> ポイントサイトからFX会社の申込ページへ飛んだ後は、途中で他のページを見たり、ブラウザの「戻る」ボタンを使ったりせず、一気に申込を完了させてください。</li>
      </ul>

      <h3>3. 結論：どこ得 ➔ 申込 ➔ 投資 のサイクルを作ろう</h3>
      <p>まずは「<a href="https://dokotoku.jp/" target="_blank" rel="noopener noreferrer">どこ得</a>」で、FX会社を検索してみてください。 そこで見つけた承認条件とポイント還元の高いサイトを経由して口座を開設し、条件を達成しましょう。これだけで、初心者のうちはほぼ儲かります。賢く始めて、余裕のある投資ライフをスタートさせましょう！</p>
    `,
  },
  {
    id: 'campaign-20260110',
    title: 'トルコリラを対象としたおすすめ3社のスワップ増額キャンペーン',
    date: '2026/01/10',
    thumbnail: '/images/campaign-20260110_60.png',
    tags: ['FX', 'トルコリラ', 'キャンペーン', 'スワップ投資'],
    content: `
      <div class="campaign-section">
        <h3>インヴァスト証券（トライオートFX）</h3>
        <p class="campaign-title">「高金利3通貨ペアスワップポイント最大60％増額キャンペーン」</p>
        <div class="campaign-details">
          <p><strong>特典内容：</strong> キャンペーン期間中のトルコリラ/円の新規買建玉（増加分）に対し、スワップポイントを60％上乗せ。</p>
          <p><strong>期間：</strong> 2026年1月5日 ～ 2026年1月30日（※要エントリー）</p>
        </div>
      </div>

      <div class="campaign-section">
        <h3>SBI FXトレード</h3>
        <p class="campaign-title">「最大30％UP！！高金利3通貨スワップ増額キャンペーン」</p>
        <div class="campaign-details">
          <p><strong>特典内容：</strong> トルコリラ/円を含む対象3通貨ペアのスワップポイントを最大30％上乗せ。</p>
          <p><strong>期間：</strong> 2025年12月1日 ～ 2026年1月31日（※要エントリー）</p>
        </div>
      </div>

      <div class="campaign-section">
        <h3>外為どっとコム</h3>
        <p class="campaign-title">「スワップポイント最大40％増額キャンペーン」</p>
        <div class="campaign-details">
          <p><strong>特典内容：</strong> トルコリラ/円のスワップポイントを40％増額。</p>
          <p><strong>期間：</strong> 2025年12月29日 ～ 2026年1月31日（※要エントリー）</p>
        </div>
      </div>
    `,
  },
  {
    id: 'risk-management-20260109',
    title: 'トルコリラ投資の安全圏はどこ？最大変動率から逆算する「最低必要証拠金」の考え方',
    date: '2026/01/09',
    thumbnail: '/images/risk-management-20260109_60.png',
    tags: ['FX', 'トルコリラ', 'リスク管理', '長期投資'],
    content: `
      <p class="intro">高スワップポイントが魅力のトルコリラ/円（TRY/JPY）。しかし、その裏側にある「価格変動リスク」を正しく把握しなければ、一瞬でロスカットの憂き目に遭う可能性もあります。本記事では、過去のデータから導き出す「最大変動率」と、FX会社の「ロスカットルール」をもとに、破綻しないために最低限必要な証拠金（レバレッジ）の計算方法を解説します。</p>

      <h3>1. 過去5年のデータに見る「トルコリラの下落幅」</h3>
      <p>リスク管理の第一歩は、過去の暴落を知ることです。トルコリラは過去5年で、数多くの「歴史的急落」を経験しています。</p>
      
      <table class="article-table">
        <thead>
          <tr>
            <th>期間</th>
            <th>出来事</th>
            <th>最大下落幅（目安）</th>
            <th>1日あたりの最大下落率</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2021年11月〜12月</td>
            <td>エルドアン大統領の低金利政策強行</td>
            <td>約40%以上</td>
            <td>約10〜15%</td>
          </tr>
          <tr>
            <td>2023年6月</td>
            <td>大統領選後のリラ安容認</td>
            <td>約20%以上</td>
            <td>約7%</td>
          </tr>
        </tbody>
      </table>
      <p>※特に2021年末の「リラ・ショック」時には、わずか1日で10%を超える下落を記録しました。</p>

      <h3>2. ロスカット率が証拠金に与える影響</h3>
      <p>FX会社には、資産を守るための「ロスカットルール」があります。多くの会社では、証拠金維持率が100%（または50%）を下回ると強制決済が行われます。</p>
      <ul>
        <li><strong>SBI FXトレード：</strong> 証拠金維持率 50% でロスカット</li>
        <li><strong>外為どっとコム：</strong> 証拠金維持率 100% でロスカット</li>
      </ul>
      <p>この基準が高いほど、下落時に耐えられる余裕（余剰証拠金）を多く持つ必要があります。</p>

      <h3>3. シミュレーション：下落に耐えるための必要証拠金</h3>
      <p>現在のレートを 3.7円、1万通貨（約37,000円分）を保有する場合で計算してみましょう。</p>
      
      <h4>運用スタイル別・必要証拠金の目安</h4>
      <table class="article-table">
        <thead>
          <tr>
            <th>運用スタイル</th>
            <th>レバレッジ</th>
            <th>入金する証拠金</th>
            <th>特徴</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>超安全運用</td>
            <td>1倍</td>
            <td>37,000円</td>
            <td>外貨預金と同じ。どれだけ暴落してもロスカットなし。</td>
          </tr>
          <tr>
            <td>積極運用</td>
            <td>2倍</td>
            <td>18,500円</td>
            <td>30%の下落にも十分耐えられる。スワップ効率が良い。</td>
          </tr>
          <tr>
            <td>超高リスク</td>
            <td>5倍以上</td>
            <td>7,400円以下</td>
            <td><span style="color: #ef4444; font-weight: bold;">【危険】</span> 1日〜数日の急落で即ロスカットの可能性大。</td>
          </tr>
        </tbody>
      </table>

      <h4>【検証】超高リスク運用（レバレッジ10倍など）は可能か？</h4>
      <p>レバレッジ10倍で運用した場合、証拠金は3,700円です。この場合、わずか0.3円〜0.4円（約10%）の下落で証拠金維持率が限界に達し、強制ロスカットとなります。過去のデータが示す通り、トルコリラにとって「1日10%の下落」は現実に起こりうる数字です。つまり、レバレッジ10倍は「運が良ければ数日生き残れるが、1回の急変で即退場」というギャンブルに近い運用となりますので、リスクを承知の上での運用が求められます。</p>

      <h3>4. 結論：トルコリラは「レバレッジ2倍以下」なら基本的には安全。</h3>
      <p>大きなレバレッジを取るならリスクを理解して運用しましょう。</p>
    `,
  },
  {
    id: 'performance-review-20260108',
    title: '【2025年トルコリラ投資の実績】トルコリラ投資、スワップ込みで結局いくら儲かった？',
    date: '2026/01/08',
    thumbnail: '/images/performance-review-20260108_60.png',
    tags: ['FX', 'トルコリラ', '投資実績', 'スワップ投資'],
    content: `
      <p class="intro">高金利通貨として注目を集め続けるトルコリラ/円（TRY/JPY）。「為替で負けてもスワップで勝てる」と言われるこの通貨ペアで、2025年の1年間運用した場合の驚きの収益結果を検証します。</p>

      <h3>1. 2025年の運用パフォーマンス結果</h3>
      <p>2025年の1年間、1万通貨を買い持ち（ロング）し続けた場合のトータル収益は以下の通りとなりました。</p>

      <table class="article-table">
        <thead>
          <tr>
            <th>項目</th>
            <th>数値（1万通貨あたり）</th>
            <th>備考</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>スワップ益</td>
            <td><span style="color: #10b981; font-weight: bold;">+約12,775円</span></td>
            <td>年間平均35円(キャンペーン考慮)/日×365日で計算</td>
          </tr>
          <tr>
            <td>為替差損益</td>
            <td><span style="color: #ef4444; font-weight: bold;">▲約8,040円</span></td>
            <td>始値4.455円 → 終値3.651円</td>
          </tr>
          <tr>
            <td>トータル損益</td>
            <td><span style="color: #2563eb; font-weight: bold;">+4,735円</span></td>
            <td>スワップで為替損をカバー！</td>
          </tr>
        </tbody>
      </table>

      <h4>年利換算での収益率</h4>
      <p>レバレッジを抑えた安全運用（レバレッジ2倍：証拠金約22,000円）の場合、<span style="color: #ef4444; font-size: 1.2em; font-weight: bold; background: linear-gradient(transparent 60%, #fef08a 60%);">年間収益率は約21.5%</span>という極めて高いパフォーマンスを記録しました。</p>
      
      <h4>【注目】キャンペーンによる「底上げ」</h4>
      <p>2025年は、各社が顧客獲得のために「他社より1円でも高く」というスワップ競争を激化させていました。</p>
      <ul>
        <li><strong>通常時：</strong> 1日あたり 20円〜28円程度(目安)</li>
        <li><strong>キャンペーン時：</strong> 1日あたり 35円〜45円程度(目安)</li>
      </ul>
      <p>これらを年間で平均化すると、おおよそ35円/日（1万通貨あたり）が実態に近い平均的な受取水準となります。</p>

      <h3>2. なぜ2025年は「勝ち」だったのか？</h3>
      <p>2025年の相場を支えたのは、トルコ中央銀行による徹底した高金利政策（政策金利50%前後）の維持です。</p>
      <ul>
        <li><strong>圧倒的な金利差：</strong> 円安局面は一服したものの、日本との圧倒的な金利差により、1日あたりのスワップポイントが高水準で安定しました。</li>
        <li><strong>為替の安定期：</strong> 過去のリラ・ショックのような急落が2025年は限定的であり、緩やかな下落（年率約18%）に留まったため、スワップ収益が為替のマイナスを上回る形となりました。</li>
      </ul>

      <h3>3. 2026年への展望と注意点</h3>
      <p>現在（2026年1月）も、各社激しいキャンペーン合戦を繰り広げています。2025年の実績が示す通り、「為替が年間20%程度の下落で収まれば、スワップで十分に利益が出る」という構造は、現在のトルコの超高金利政策が続く限り、2026年も有効な戦略と考えられます。</p>
    `,
  },
];
