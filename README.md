# 🃏 Cluoker (線索撲克)

**Cluoker** is an original logic deduction and risk-management game played with a standard 52-card deck. Players must accurately pinpoint their hidden "Answer Card" by playing "Clues" and analyzing Boolean (Yes/No) feedback, without ever seeing their own card.

**Cluoker** 是一款結合邏輯排除與風險管理的推理遊戲。玩家必須在看不見自己牌面的情況下，透過「投放探針」獲得是非回饋，藉此精確定位自己的底牌。只需一副標準撲克牌即可隨時遊玩。

* **Players:** 2-6
* **Play Time:** 10-15 mins
* **Mechanics:** Deduction, Hand Management, Boolean Logic

---

## 中文規則

### 遊戲準備
1. **答案卡 (Answer Card)：** 每位玩家發 1 張牌作為答案。
   > **注意：** 你絕對不能看自己的答案卡！請將牌面向外展示給所有對手看，確認大家都看到後，**將其「面朝下」蓋在自己面前的桌上**。若遊戲中途有人忘記，可以隨時要求再次確認，但唯獨你自己不能看。
2. **手牌 (Hand)：** 每位玩家發 3 張牌，這些牌只有自己能看到。
3. **牌堆 (Deck)：** 將剩下的牌放在桌面中央作為抽牌區。

### 遊戲流程
由一位起始玩家開始，依順時針方向輪流執行以下步驟：

1. **投放線索：** 從手牌中選出 1 張牌，打在自己面前的桌面上（此為公開資訊）。
2. **詢問判定：** 詢問其他玩家：「這張是線索嗎？」其他玩家根據**「線索準則」**集體給予**「是」或「否」**的誠實回答。
3. **狀態紀錄 (UI/UX)：** 為了方便追蹤邏輯狀態，建議玩家根據得到的答案調整桌面上牌的擺放方式：
   * **回答「是」：** 將該張牌 **直放**。
   * **回答「否」：** 將該張牌 **橫放**。
   *(或者採用左右分區放置，只要全場統一且能明確辨識即可)*
4. **補牌：** 從抽牌區抽 1 張牌，維持手牌為 3 張。
5. **結束回合：** 換下一位玩家。

### 📏 線索準則 (The ±1 Rule)
當你打出的牌符合以下**任一條件**時，它就是「線索」（其他人必須回答「是」）：

* **同花色：** 出的牌與你的答案卡花色相同。
* **數字相鄰或相同：** 出的牌數字與答案卡數字差值為 ±1 或 0。（數值換算：A=1, J=11, Q=12, K=13）。
* **環狀結構：** 數字首尾相連。也就是說，A 與 K 互為相鄰線索。

> **💡 範例：** 若你的答案卡是 **紅心 5**。
> 當你打出「任何紅心」或「任何花色的 4、5、6」時，其他人都必須回答「是」。打出除此之外的牌，別人都必須回答「否」。

### 🏆 勝利與宣告
* **宣告時機：** 在你的回合，你可以選擇不投放線索，直接宣告「我要猜答案」。
* **生死一擊：** 整場遊戲每人只有 **1 次**猜測機會。
* **猜錯：** 直接淘汰出局。
* **猜對與勝利：** 先猜對目標答案的玩家即為贏家。若多位玩家在同一輪次（花費相同回合數）內皆猜對答案，則判定為**平手**。

---

## English Rules

### Setup
1. **Answer Card:** Deal 1 card to each player. 
   > **Note:** You CANNOT look at your own Answer Card! Show the card face-out to all other players. Once everyone has seen it, **place it face-down on the table in front of you**. If anyone forgets, they can ask to see it again, but you must never look at it yourself.
2. **Hand:** Deal 3 cards to each player. Keep these hidden from other players.
3. **Deck:** Place the remaining cards face-down in the center of the table as the draw pile.

### Gameplay
Choose a starting player. Play proceeds clockwise. On your turn, complete the following steps:

1. **Play a Clue:** Choose 1 card from your hand and play it face-up on the table in front of you.
2. **Ask for Verification:** Ask the other players, *"Is this a clue?"* The other players must collectively and honestly answer **"Yes" or "No"** based on the **Clue Criteria**.
3. **State Tracking (UI/UX):** To help track the logical state, it is recommended to adjust the orientation of the played card based on the feedback:
   * **If "Yes":** Place the card **vertically**.
   * **If "No":** Place the card **horizontally**.
   *(Alternatively, separate them into left/right zones. Just ensure the method is consistent and clear).*
4. **Draw:** Draw 1 card from the deck to maintain a 3-card hand.
5. **End Turn:** Play passes to the next player.

### 📏 The Clue Criteria (The ±1 Rule)
A card you play is considered a "Clue" (and receives a "Yes") if it meets **ANY** of the following conditions:

* **Same Suit:** The played card matches the suit of your Answer Card.
* **Adjacent or Exact Value:** The played card's value is exactly ±1 or equal to your Answer Card. (Values: A=1, J=11, Q=12, K=13).
* **Wrap-around:** The values wrap around, meaning Ace (A) and King (K) are considered adjacent.

> **💡 Example:** If your Answer Card is the **5 of Hearts**.
> If you play ANY Heart, or ANY 4, 5, or 6 (regardless of suit), the answer is "Yes". For any other card, the answer is "No".

### 🏆 Winning & Guessing
* **Making a Guess:** On your turn, instead of playing a clue card, you may declare that you are guessing your Answer Card.
* **One Shot:** Each player has only **ONE** chance to guess per game.
* **Wrong Guess:** You are immediately eliminated from the game.
* **Correct Guess & Victory:** The first player to correctly guess their card wins. If multiple players guess correctly within the same round (using the exact same number of turns), the game ends in a **draw**.

---
*Game Design by Hung Jui Chang, 2026. Feel free to fork, play, and share!*
