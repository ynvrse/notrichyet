# NotRichYet - Money Tracking App for Gen Z

## 📱 App Overview

**NotRichYet** adalah aplikasi money tracking yang dirancang khusus untuk Gen Z dengan fokus pada kemudahan pencatatan keuangan dan fitur social hangout/nongkrong dengan split bill.

### Target Users

- **Primary**: Gen Z Indonesia (18-25 tahun)
- **Characteristics**: Tidak suka kerumitan, mobile-first, social-oriented, sering nongkrong bareng

### Core Philosophy

- **Simplicity over Features**: Lebih baik sederhana dan mudah digunakan
- **Mobile PWA**: Pengalaman seperti native app
- **Social Finance**: Menggabungkan tracking personal dengan social spending

---

## 🎯 App Structure

### Navigation: 5 Floating Menu

1. **🏠 Home** - Dashboard & recent transactions
2. **➕ Add** - Quick add income/expense
3. **💸 Expense** - List semua pengeluaran
4. **🎉 Hangout** - Social expenses & split bills (NEW PAGE)
5. **📊 Summary** - Charts & financial insights

### Profile Access

- **Profile moved to Avatar Click**: Ketika user klik avatar mereka, muncul profile settings
- Mengurangi clutter di floating menu

---

## 🛠 Technical Architecture

### Database Schema (InstantDB)

#### Core Entities

```javascript
// Personal Finance
- profiles: User data
- categories: Income/expense categories
- incomes: Personal income tracking
- expenses: Personal expense tracking (dapat link ke hangout)
- savings: Savings goals

// Social Finance (Hangout System)
- hangouts: Event/wacana nongkrong
- hangoutParticipants: Siapa saja yang join
- hangoutExpenses: Expense yang dibagi dalam hangout
```

#### Key Features

- **Hangout Owner**: Dapat mengatur split rules
- **Flexible Split Methods**:
    - `equal`: Dibagi rata
    - `percentage`: Berdasarkan persentase
    - `manual`: Manual assign amount
    - `treat`: Ada yang traktir X%
- **Join System**: Join code untuk invite teman
- **Real-time Chat**: InstantDB rooms untuk komunikasi

---

## 🎮 Hangout System Design

### Flow Hangout/Nongkrong

#### 1. Create Hangout (Owner)

```
Owner creates "Nongkrong Cafe A"
↓
Sets split rules: "Bagi rata" atau "Gue traktir 50%"
↓
Gets join code: "ABC123"
↓
Share code ke teman
```

#### 2. Join Hangout (Participants)

```
User masuk join code "ABC123"
↓
Melihat hangout details & split rules
↓
Confirm join → jadi participant
```

#### 3. During Hangout

```
Siapapun bisa add expense: "Makan siang - 100k"
↓
Expense otomatis di-split sesuai rules
↓
Real-time update ke semua participants
↓
Chat untuk koordinasi
```

#### 4. Settlement

```
Owner dapat settle hangout
↓
Generate summary siapa bayar berapa
↓
Expense otomatis masuk ke personal expense masing-masing
```

### Split Rules Examples

#### Equal Split

```json
{
    "method": "equal",
    "rules": null
}
// 100k dibagi 4 orang = 25k per orang
```

#### Percentage Split

```json
{
    "method": "percentage",
    "rules": {
        "owner_treats": 50,
        "others_split": 50
    }
}
// Owner bayar 50k, sisanya dibagi rata
```

#### Manual Split

```json
{
    "method": "manual",
    "rules": {
        "user1": 40000,
        "user2": 30000,
        "user3": 30000
    }
}
```

---

## 🔄 User Experience Flow

### Personal Finance Flow

```
Home → View balance & recent
Add → Quick input income/expense
Expense → See all personal spending
Summary → Charts & insights
Avatar → Profile & settings
```

### Social Finance Flow

```
Hangout → See active hangouts
Create → New hangout dengan rules
Join → Enter code dari teman
In-Hangout → Add expenses, chat, settlement
```

---

## 📊 Data Relationships

### Personal to Social Connection

- `expenses.hangoutId` → Links personal expense ke hangout
- Ketika hangout settled, auto-create personal expenses untuk participants

### Key Relationships

```
hangouts (1) → (many) hangoutParticipants
hangouts (1) → (many) hangoutExpenses
hangoutExpenses (1) → (1) user (paidById)
expenses (many) → (1) hangout (optional)
```

---

## 🚀 Development Priorities

### Phase 1: Personal Finance MVP

- [ ] Basic CRUD for income/expense
- [ ] Simple categories
- [ ] Dashboard with balance
- [ ] PWA setup

### Phase 2: Hangout System

- [ ] Create/join hangout
- [ ] Basic split bill (equal only)
- [ ] Settlement flow
- [ ] Link to personal expenses

### Phase 3: Enhanced Social

- [ ] Advanced split methods
- [ ] Real-time chat
- [ ] Expense photos/receipts
- [ ] Notifications

### Phase 4: Polish

- [ ] Charts & analytics
- [ ] Export features
- [ ] Offline support
- [ ] Push notifications

---

## 🎨 Design Considerations

### Gen Z UX Principles

- **Instant Gratification**: Quick actions, minimal taps
- **Visual First**: Icons, colors, minimal text
- **Social Context**: Show friends, activities, not just numbers
- **Mobile Native**: Thumb-friendly, gesture-based

### Color Psychology

- **Green**: Money in (positive)
- **Red**: Money out (attention)
- **Purple**: Goals/savings (aspirational)
- **Orange**: Social/hangout (fun, energetic)

---

## 🔒 Privacy & Security

### Data Sensitivity

- **Personal Finance**: Sangat sensitif, user-only access
- **Hangout Data**: Semi-public dalam group, tapi limited scope
- **Profile**: Basic info only, no financial data

### Access Control

- Personal expenses: User dapat akses data mereka saja
- Hangout: Participants dapat lihat hangout expenses
- Profile: Public basic info untuk hangout display

---

## 📈 Success Metrics

### Engagement

- Daily active users posting transactions
- Hangout creation & participation rate
- Time spent in app per session

### Financial Health

- Consistent expense logging
- Savings goal completion rate
- Improved spending awareness

### Social Features

- Hangout completion rate (created → settled)
- User retention after first hangout
- Referrals through join codes

---

## 🔮 Future Enhancements

### Advanced Features (Post-MVP)

- **AI Categorization**: Smart expense categorization
- **Budget Alerts**: Spending limit notifications
- **Investment Tracking**: Basic portfolio tracking
- **Recurring Transactions**: Automated regular entries
- **Group Challenges**: Social savings challenges

### Integration Possibilities

- **Bank APIs**: Auto-import transactions
- **E-wallet APIs**: Link to GoPay, OVO, DANA
- **Social Media**: Share achievements, invite friends
- **Maps API**: Location-based expense logging

---

## 🎯 Key Differentiators

### vs Traditional Finance Apps

- **Social-First**: Built around social spending habits
- **Gen Z UX**: Instagram-like interface, not bank-like
- **Simplified**: Core features only, no overwhelming options

### vs Split Bill Apps

- **Integrated**: Personal finance + social in one app
- **Persistent**: Long-term tracking, bukan just one-time split
- **Context-Aware**: Expenses masuk ke personal tracking juga

---

This documentation serves as the foundation for building NotRichYet and can guide future AI assistants in understanding the project's vision, technical decisions, and user-centered design approach.
