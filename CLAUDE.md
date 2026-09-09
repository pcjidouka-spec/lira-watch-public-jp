@AGENTS.md

## Claude Code 固有

AGENTS.md に書いてあることはここで繰り返さない。Claude Code だけが解釈できるものに限る。

- このリポジトリには `.claude/` の設定もフックも無い。beads も使っていない
- ★上流のデータ収集パイプラインは**別リポジトリ**にあり、そちらの指示は届かない。
  収集ロジックの修正はそちらで行う

## Testing

テストランナーは **vitest**。対象は `lib/**/*.test.ts` だけ (`vitest.config.ts` の `include`)。

```bash
npm test        # vitest run
npm run lint    # next lint (警告のみ。exit 0)
npx tsc --noEmit  # ★型チェックは build に含まれないので別途走らせる
```

- ベースラインは `.migration-test.txt` にある
- ★UI コンポーネントのテストは無い (`environment: 'node'` のため DOM も無い)。
  カバレッジを問われたら「`lib/` の純関数のみ」と答える
- ★`npm run build` は作業ツリーを汚す (`public/data/ranking_*.json` の `generated_at`)。
  テスト目的で走らせたら `git checkout -- public/data` で戻す

## Skill routing

★**この節は gstack などのスキルをユーザー環境に導入している場合の道案内**である。
スキルはこのリポジトリに同梱されていない (`.claude/` も `SKILL.md` も無い)。
★**利用できるスキルの一覧に無いものは呼ばない。**その場合はこの節を無視して通常どおり作業する。

When the user's request matches an available skill, ALWAYS invoke it using the Skill
tool as your FIRST action. Do NOT answer directly, do NOT use other tools first.
The skill has specialized workflows that produce better results than ad-hoc answers.

Key routing rules:
- Product ideas, "is this worth building", brainstorming → invoke office-hours
- Bugs, errors, "why is this broken", 500 errors → invoke investigate
- Ship, deploy, push, create PR → invoke ship
- QA, test the site, find bugs → invoke qa
- Code review, check my diff → invoke review
- Update docs after shipping → invoke document-release
- Weekly retro → invoke retro
- Design system, brand → invoke design-consultation
- Visual audit, design polish → invoke design-review
- Architecture review → invoke plan-eng-review
- Save progress, checkpoint, resume → invoke checkpoint
- Code quality, health check → invoke health
- セッション終了、区切る、wrap up、commit+push して次予定 → invoke session-close
