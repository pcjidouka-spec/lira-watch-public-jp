# トルコリラ・ウォッチ (Lira-Watch) 🇹🇷💹

[![Next.js](https://img.shields.io/badge/Framework-Next.js%2014-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Data-Python-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![Selenium](https://img.shields.io/badge/Scraping-Selenium-43B02A?logo=selenium&logoColor=white)](https://www.selenium.dev/)
[![GitHub Pages](https://img.shields.io/badge/Hosting-GitHub%20Pages-222222?logo=github&logoColor=white)](https://pages.github.com/)

トルコリラ円（TRY/JPY）の各FX会社の公式データを毎日自動収集し、スワップポイントを視覚化・比較する投資支援ツールです。  
「情報の透明化」と「データ駆動型の意思決定」をテーマに構築しました。

[サイトURL: https://www.lira-watch.sbs](https://www.lira-watch.sbs)

---

## 📋 プロジェクト概要

このプロジェクトは、投資家が最も有利なFX会社を即座に判断できるよう、複雑に分散している各社のスワップ情報を一箇所に集約・分析することを目的としています。
単なる静的なサイトではなく、**「データ収集の自動化（Python/Scraping）」**と**「モダンなフロントエンド（Next.js/TypeScript）」**を組み合わせたフルスタックなシステムとして設計・運用しています。

### 解決したい課題
- **情報収集コストの削減**: 各FX会社のサイトを個別に確認する手間の解消。
- **機会損失の防止**: キャンペーン情報のリアルタイム検知により、有利な取引チャンスを逃さない。
- **データに基づいた長期分析**: 過去データの蓄積による、スワップポイントの安定性と収益性の可視化。

---

## 🏗 システム構成（アーキテクチャ）

本システムは、プライベートなデータ収集層と、パブリックな表示層の2層構造で構成されています。

1. **Extraction (Private)**: 
   - Python + Seleniumによる自動スクレイピング。
   - キャンペーンページのHTMLハッシュ値を監視し、更新を自動検知。
2. **Transform & Sync**:
   - 取得データの正規化、CSV/JSONへの変換。
   - PowerShellによる自動コミット・プッシュをタスクスケジューラで実行。
3. **Presentation (Public)**: 
   - Next.js (SSG) による高速なページ表示。
   - Rechartsを用いたインタラクティブな推移グラフ。

---

## 🛠 技術スタック

| 分野 | 技術 |
|:---|:---|
| **Frontend** | Next.js 14, React, TypeScript, styled-jsx |
| **Data Viz** | Recharts (グラフ描画), PapaParse (CSV解析) |
| **Automation** | Python (Selenium), PowerShell, Task Scheduler |
| **Infrastructure** | GitHub Pages, Custom Domain (lira-watch.sbs) |

---

## ✨ 主な機能

- 🥇 **動的ランキング**: 買い/売りスワップのリアルタイムランキング表示。
- 🔔 **キャンペーン検知**: サイト更新を自動検知し、表に「New」バッジを付与。
- 📈 **インタラクティブ・チャート**: 期間指定可能なスワップ推移グラフ。
- ⚡ **超高速表示**: 静的サイト生成(SSG)により、モバイル環境でもストレスのない閲覧。

---

## 💡 プロジェクトを通じた学び（IT初学者としての挑戦）

- **エンジニアリングによる解決**: 自身の個人的な悩みを、技術（スクレイピングと自動化）によって解決するプロセスを経験。
- **保守性の高いコード**: 型安全性（TypeScript）や共通ユーティリティ化により、機能追加が容易な設計を意識。
- **継続的な運用**: 安定して毎日データを取得し続けるための、エラーハンドリングとログ管理の実装。

---

## 🚀 セットアップ（開発者向け）

```bash
git clone https://github.com/pcjidouka-spec/lira-watch-public-jp.git
cd lira-watch-public-jp
npm install
npm run dev
```

---

## 📑 免責事項
本プロジェクトは学習および個人利用を目的としたポートフォリオです。
情報の正確性には細心の注意を払っておりますが、最終的な投資判断は自己責任で行ってください。

© 2026 [Your Name / pcjidouka-spec]
