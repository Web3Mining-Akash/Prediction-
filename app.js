// SportsBet Mini App - JavaScript

// Immediately start the app when script loads
(function() {
    'use strict';
    
    class SportsBetApp {
        constructor() {
            // Application data (in-memory storage)
            this.appData = {
                users: [
                    {
                        id: "user_1",
                        telegramId: "123456789",
                        firstName: "John",
                        username: "johnbetter",
                        walletBalance: 2850.75,
                        referralCode: "REF-JOH123",
                        referredBy: null,
                        totalBets: 45,
                        totalWins: 28,
                        totalEarnings: 1240.50,
                        joinedDate: "2025-08-15"
                    }
                ],
                contests: [
                    {
                        id: "contest_1",
                        title: "India vs Australia",
                        description: "Test Match - Day 1",
                        category: "cricket",
                        startTime: "2025-09-24T09:00:00Z",
                        bettingDeadline: "2025-09-24T08:30:00Z",
                        status: "active",
                        options: [
                            { id: "opt_1", label: "India Win", odds: 2.1 },
                            { id: "opt_2", label: "Draw", odds: 3.5 },
                            { id: "opt_3", label: "Australia Win", odds: 2.8 }
                        ],
                        totalBets: 156,
                        totalPool: 15600.00
                    },
                    {
                        id: "contest_2",
                        title: "Manchester City vs Arsenal",
                        description: "Premier League",
                        category: "football",
                        startTime: "2025-09-23T18:00:00Z",
                        bettingDeadline: "2025-09-23T17:30:00Z",
                        status: "active",
                        options: [
                            { id: "opt_4", label: "City Win", odds: 1.8 },
                            { id: "opt_5", label: "Draw", odds: 3.2 },
                            { id: "opt_6", label: "Arsenal Win", odds: 4.1 }
                        ],
                        totalBets: 203,
                        totalPool: 25400.00
                    },
                    {
                        id: "contest_3",
                        title: "Lakers vs Warriors",
                        description: "NBA Regular Season",
                        category: "basketball",
                        startTime: "2025-09-23T22:00:00Z",
                        bettingDeadline: "2025-09-23T21:30:00Z",
                        status: "active",
                        options: [
                            { id: "opt_7", label: "Lakers Win", odds: 2.3 },
                            { id: "opt_8", label: "Warriors Win", odds: 1.7 }
                        ],
                        totalBets: 89,
                        totalPool: 8900.00
                    }
                ],
                userBets: [
                    {
                        id: "bet_1",
                        userId: "user_1",
                        contestId: "contest_1",
                        optionId: "opt_1",
                        amount: 100.00,
                        platformFee: 10.00,
                        odds: 2.1,
                        potentialWinning: 210.00,
                        status: "pending",
                        placedAt: "2025-09-23T10:30:00Z"
                    },
                    {
                        id: "bet_2",
                        userId: "user_1",
                        contestId: "contest_2",
                        optionId: "opt_4",
                        amount: 50.00,
                        platformFee: 5.00,
                        odds: 1.8,
                        potentialWinning: 90.00,
                        status: "won",
                        placedAt: "2025-09-22T15:20:00Z",
                        settledAt: "2025-09-22T20:30:00Z"
                    }
                ],
                transactions: [
                    {
                        id: "tx_1",
                        userId: "user_1",
                        type: "deposit",
                        amount: 500.00,
                        status: "completed",
                        description: "Wallet deposit",
                        timestamp: "2025-09-20T14:30:00Z"
                    },
                    {
                        id: "tx_2",
                        userId: "user_1",
                        type: "bet",
                        amount: -100.00,
                        status: "completed",
                        description: "Bet on India vs Australia",
                        timestamp: "2025-09-23T10:30:00Z"
                    },
                    {
                        id: "tx_3",
                        userId: "user_1",
                        type: "winning",
                        amount: 90.00,
                        status: "completed",
                        description: "Won bet on Manchester City",
                        timestamp: "2025-09-22T20:30:00Z"
                    },
                    {
                        id: "tx_4",
                        userId: "user_1",
                        type: "referral",
                        amount: 25.00,
                        status: "completed",
                        description: "Referral commission - Level 1",
                        timestamp: "2025-09-21T16:45:00Z"
                    }
                ]
            };

            this.currentUser = this.appData.users[0];
            this.currentSection = 'home';
            this.currentFilter = 'all';
            this.selectedBet = null;
            
            this.init();
        }

        init() {
            // Skip loading screen and go directly to login
            setTimeout(() => {
                this.showLoginScreen();
                this.setupEventListeners();
            }, 1000);
        }

        showLoginScreen() {
            const loadingScreen = document.getElementById('loading-screen');
            const loginScreen = document.getElementById('login-screen');
            
            if (loadingScreen) loadingScreen.classList.add('hidden');
            if (loginScreen) loginScreen.classList.remove('hidden');
        }

        setupEventListeners() {
            // Telegram login button
            const telegramLoginBtn = document.getElementById('telegram-login');
            if (telegramLoginBtn) {
                telegramLoginBtn.addEventListener('click', () => {
                    this.handleTelegramLogin();
                });
            }

            // Navigation buttons
            document.addEventListener('click', (e) => {
                if (e.target.closest('.nav-btn')) {
                    const btn = e.target.closest('.nav-btn');
                    const section = btn.dataset.section;
                    if (section) this.navigateToSection(section);
                }

                // Contest filter buttons
                if (e.target.classList.contains('filter-btn')) {
                    const category = e.target.dataset.category;
                    if (category) this.filterContests(category);
                }

                // Option buttons for betting
                if (e.target.closest('.option-btn')) {
                    const btn = e.target.closest('.option-btn');
                    const contestId = btn.dataset.contest;
                    const optionId = btn.dataset.option;
                    if (contestId && optionId) {
                        this.openBettingModal(contestId, optionId);
                    }
                }

                // Quick amount buttons
                if (e.target.classList.contains('quick-btn')) {
                    const amount = parseFloat(e.target.dataset.amount);
                    const betAmountInput = document.getElementById('bet-amount');
                    if (betAmountInput) {
                        betAmountInput.value = amount;
                        this.updateBetCalculations();
                        
                        // Update button states
                        document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('selected'));
                        e.target.classList.add('selected');
                    }
                }

                // Modal closes
                if (e.target.id === 'close-modal') {
                    this.closeBettingModal();
                }
                if (e.target.id === 'close-transaction-modal') {
                    this.closeTransactionModal();
                }

                // Confirm buttons
                if (e.target.id === 'confirm-bet') {
                    this.confirmBet();
                }
                if (e.target.id === 'confirm-transaction') {
                    this.confirmTransaction();
                }

                // Wallet buttons
                if (e.target.id === 'deposit-btn') {
                    this.openTransactionModal('deposit');
                }
                if (e.target.id === 'withdraw-btn') {
                    this.openTransactionModal('withdraw');
                }

                // Copy referral link
                if (e.target.id === 'copy-link') {
                    this.copyReferralLink();
                }

                // Modal backdrop clicks
                if (e.target.classList.contains('modal')) {
                    if (e.target.id === 'betting-modal') {
                        this.closeBettingModal();
                    } else if (e.target.id === 'transaction-modal') {
                        this.closeTransactionModal();
                    }
                }
            });

            // Bet amount input
            const betAmountInput = document.getElementById('bet-amount');
            if (betAmountInput) {
                betAmountInput.addEventListener('input', () => {
                    this.updateBetCalculations();
                    document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('selected'));
                });
            }
        }

        handleTelegramLogin() {
            const loginScreen = document.getElementById('login-screen');
            const mainApp = document.getElementById('main-app');
            
            if (loginScreen) loginScreen.classList.add('hidden');
            if (mainApp) mainApp.classList.remove('hidden');
            
            this.loadInitialData();
        }

        loadInitialData() {
            this.updateUserBalance();
            this.renderContests();
            this.renderBets();
            this.renderTransactions();
            this.renderReferralActivity();
        }

        navigateToSection(section) {
            // Update navigation
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            const activeNavBtn = document.querySelector(`[data-section="${section}"]`);
            if (activeNavBtn) {
                activeNavBtn.classList.add('active');
            }

            // Update sections
            document.querySelectorAll('.section').forEach(sec => {
                sec.classList.remove('active');
            });
            const activeSection = document.getElementById(`${section}-section`);
            if (activeSection) {
                activeSection.classList.add('active');
            }

            this.currentSection = section;

            // Load section-specific data
            switch(section) {
                case 'bets':
                    this.renderBets();
                    break;
                case 'wallet':
                    this.renderTransactions();
                    break;
                case 'referrals':
                    this.renderReferralActivity();
                    break;
            }
        }

        filterContests(category) {
            // Update filter buttons
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            const activeFilterBtn = document.querySelector(`[data-category="${category}"]`);
            if (activeFilterBtn) {
                activeFilterBtn.classList.add('active');
            }

            this.currentFilter = category;
            this.renderContests();
        }

        renderContests() {
            const contestsList = document.getElementById('contests-list');
            if (!contestsList) return;

            const filteredContests = this.currentFilter === 'all' 
                ? this.appData.contests
                : this.appData.contests.filter(contest => contest.category === this.currentFilter);

            contestsList.innerHTML = filteredContests.map(contest => {
                const startTime = new Date(contest.startTime);
                const deadline = new Date(contest.bettingDeadline);
                
                return `
                    <div class="contest-card">
                        <div class="contest-header">
                            <div class="contest-info">
                                <h3>${contest.title}</h3>
                                <p class="contest-description">${contest.description}</p>
                            </div>
                            <span class="contest-category">${contest.category}</span>
                        </div>
                        <div class="contest-meta">
                            <div>
                                <strong>Start:</strong> ${startTime.toLocaleDateString()} ${startTime.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
                            </div>
                            <div>
                                <strong>Deadline:</strong> ${deadline.toLocaleDateString()} ${deadline.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}
                            </div>
                        </div>
                        <div class="contest-options">
                            ${contest.options.map(option => `
                                <button class="option-btn" data-contest="${contest.id}" data-option="${option.id}">
                                    <div class="option-label">${option.label}</div>
                                    <div class="option-odds">${option.odds}x</div>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }

        renderBets() {
            const betsList = document.getElementById('bets-list');
            if (!betsList) return;

            const userBets = this.appData.userBets.filter(bet => bet.userId === this.currentUser.id);

            betsList.innerHTML = userBets.map(bet => {
                const contest = this.appData.contests.find(c => c.id === bet.contestId);
                const option = contest ? contest.options.find(o => o.id === bet.optionId) : null;
                const placedDate = new Date(bet.placedAt);

                if (!contest || !option) return '';

                return `
                    <div class="bet-card">
                        <div class="bet-header">
                            <h4 class="bet-title">${contest.title}</h4>
                            <span class="bet-status ${bet.status}">${bet.status.toUpperCase()}</span>
                        </div>
                        <div class="bet-details">
                            <div class="bet-detail">
                                <span>Selection:</span>
                                <span>${option.label}</span>
                            </div>
                            <div class="bet-detail">
                                <span>Amount:</span>
                                <span>₹${bet.amount.toFixed(2)}</span>
                            </div>
                            <div class="bet-detail">
                                <span>Odds:</span>
                                <span>${bet.odds}x</span>
                            </div>
                            <div class="bet-detail">
                                <span>Potential Win:</span>
                                <span>₹${bet.potentialWinning.toFixed(2)}</span>
                            </div>
                            <div class="bet-detail">
                                <span>Placed:</span>
                                <span>${placedDate.toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        renderTransactions() {
            const transactionsList = document.getElementById('transactions-list');
            if (!transactionsList) return;

            const userTransactions = this.appData.transactions
                .filter(tx => tx.userId === this.currentUser.id)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            transactionsList.innerHTML = userTransactions.map(tx => {
                const date = new Date(tx.timestamp);
                const isPositive = tx.amount > 0;
                
                return `
                    <div class="transaction-item">
                        <div class="transaction-info">
                            <p class="transaction-description">${tx.description}</p>
                            <p class="transaction-date">${date.toLocaleDateString()} ${date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'})}</p>
                        </div>
                        <div class="transaction-amount ${isPositive ? 'positive' : 'negative'}">
                            ${isPositive ? '+' : ''}₹${Math.abs(tx.amount).toFixed(2)}
                        </div>
                    </div>
                `;
            }).join('');
        }

        renderReferralActivity() {
            const referralActivity = document.getElementById('referral-activity');
            if (!referralActivity) return;

            const mockReferrals = [
                {
                    username: "@alice_crypto",
                    joinDate: "2025-09-18T12:00:00Z",
                    commission: 75.50,
                    level: 1
                },
                {
                    username: "@bob_trader",
                    joinDate: "2025-09-15T08:30:00Z",
                    commission: 45.25,
                    level: 1
                },
                {
                    username: "@charlie_bet",
                    joinDate: "2025-09-12T16:45:00Z",
                    commission: 32.75,
                    level: 2
                }
            ];

            referralActivity.innerHTML = mockReferrals.map(referral => {
                const joinDate = new Date(referral.joinDate);
                return `
                    <div class="referral-item">
                        <div class="referral-user">
                            <p class="referral-username">${referral.username}</p>
                            <p class="referral-date">Joined ${joinDate.toLocaleDateString()} (Level ${referral.level})</p>
                        </div>
                        <div class="referral-commission">+₹${referral.commission.toFixed(2)}</div>
                    </div>
                `;
            }).join('');
        }

        openBettingModal(contestId, optionId) {
            const contest = this.appData.contests.find(c => c.id === contestId);
            const option = contest ? contest.options.find(o => o.id === optionId) : null;

            if (!contest || !option) return;

            this.selectedBet = { contestId, optionId, contest, option };

            // Update modal content
            const modalTitle = document.getElementById('modal-contest-title');
            const betOptionInfo = document.getElementById('bet-option-info');
            
            if (modalTitle) modalTitle.textContent = contest.title;
            if (betOptionInfo) {
                betOptionInfo.innerHTML = `
                    <div class="option-selection">${option.label}</div>
                    <div class="option-odds-display">${option.odds}x odds</div>
                `;
            }

            // Reset form
            const betAmountInput = document.getElementById('bet-amount');
            if (betAmountInput) betAmountInput.value = '';
            
            document.querySelectorAll('.quick-btn').forEach(btn => btn.classList.remove('selected'));
            this.updateBetCalculations();

            // Show modal
            const modal = document.getElementById('betting-modal');
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.add('show'), 10);
            }
        }

        closeBettingModal() {
            const modal = document.getElementById('betting-modal');
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.classList.add('hidden');
                    this.selectedBet = null;
                }, 300);
            }
        }

        updateBetCalculations() {
            if (!this.selectedBet) return;

            const betAmountInput = document.getElementById('bet-amount');
            const amount = betAmountInput ? parseFloat(betAmountInput.value) || 0 : 0;
            const odds = this.selectedBet.option.odds;
            const platformFee = amount * 0.1;
            const potentialWinning = amount * odds;

            const calcBetAmount = document.getElementById('calc-bet-amount');
            const calcPlatformFee = document.getElementById('calc-platform-fee');
            const calcOdds = document.getElementById('calc-odds');
            const calcPotentialWinning = document.getElementById('calc-potential-winning');

            if (calcBetAmount) calcBetAmount.textContent = `₹${amount.toFixed(2)}`;
            if (calcPlatformFee) calcPlatformFee.textContent = `₹${platformFee.toFixed(2)}`;
            if (calcOdds) calcOdds.textContent = `${odds}x`;
            if (calcPotentialWinning) calcPotentialWinning.textContent = `₹${potentialWinning.toFixed(2)}`;

            // Update button state
            const confirmBtn = document.getElementById('confirm-bet');
            if (confirmBtn) {
                const isValidAmount = amount >= 10 && amount <= 10000 && amount <= this.currentUser.walletBalance;
                confirmBtn.disabled = !isValidAmount;
            }
        }

        confirmBet() {
            if (!this.selectedBet) return;

            const betAmountInput = document.getElementById('bet-amount');
            const amount = betAmountInput ? parseFloat(betAmountInput.value) : 0;
            
            if (amount < 10 || amount > 10000 || amount > this.currentUser.walletBalance) {
                alert('Invalid bet amount');
                return;
            }

            const platformFee = amount * 0.1;
            const potentialWinning = amount * this.selectedBet.option.odds;

            // Create new bet
            const newBet = {
                id: `bet_${Date.now()}`,
                userId: this.currentUser.id,
                contestId: this.selectedBet.contestId,
                optionId: this.selectedBet.optionId,
                amount: amount,
                platformFee: platformFee,
                odds: this.selectedBet.option.odds,
                potentialWinning: potentialWinning,
                status: 'pending',
                placedAt: new Date().toISOString()
            };

            // Add bet to data
            this.appData.userBets.push(newBet);

            // Update user balance
            this.currentUser.walletBalance -= amount;
            this.updateUserBalance();

            // Add transaction
            this.addTransaction('bet', -amount, `Bet on ${this.selectedBet.contest.title}`);

            // Close modal and refresh
            this.closeBettingModal();
            this.renderBets();

            // Show success message
            this.showMessage('Bet placed successfully!', 'success');
        }

        openTransactionModal(type) {
            const modal = document.getElementById('transaction-modal');
            const title = document.getElementById('transaction-modal-title');
            
            if (title) {
                title.textContent = type === 'deposit' ? 'Deposit Funds' : 'Withdraw Funds';
            }
            
            const transactionAmountInput = document.getElementById('transaction-amount');
            if (transactionAmountInput) {
                transactionAmountInput.value = '';
            }
            
            if (modal) {
                modal.classList.remove('hidden');
                setTimeout(() => modal.classList.add('show'), 10);
            }
            
            this.currentTransactionType = type;
        }

        closeTransactionModal() {
            const modal = document.getElementById('transaction-modal');
            if (modal) {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.classList.add('hidden');
                    this.currentTransactionType = null;
                }, 300);
            }
        }

        confirmTransaction() {
            const transactionAmountInput = document.getElementById('transaction-amount');
            const amount = transactionAmountInput ? parseFloat(transactionAmountInput.value) : 0;
            
            if (!amount || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }

            if (this.currentTransactionType === 'withdraw' && amount > this.currentUser.walletBalance) {
                alert('Insufficient balance');
                return;
            }

            // Update balance
            if (this.currentTransactionType === 'deposit') {
                this.currentUser.walletBalance += amount;
            } else {
                this.currentUser.walletBalance -= amount;
            }

            this.updateUserBalance();

            // Add transaction
            const transactionAmount = this.currentTransactionType === 'deposit' ? amount : -amount;
            const description = `Wallet ${this.currentTransactionType}`;
            this.addTransaction(this.currentTransactionType, transactionAmount, description);

            this.closeTransactionModal();
            this.renderTransactions();
            
            this.showMessage(`${this.currentTransactionType.charAt(0).toUpperCase() + this.currentTransactionType.slice(1)} successful!`, 'success');
        }

        addTransaction(type, amount, description) {
            const transaction = {
                id: `tx_${Date.now()}`,
                userId: this.currentUser.id,
                type: type,
                amount: amount,
                status: 'completed',
                description: description,
                timestamp: new Date().toISOString()
            };

            this.appData.transactions.push(transaction);
        }

        updateUserBalance() {
            const balanceElements = document.querySelectorAll('#user-balance, .balance-display');
            balanceElements.forEach(el => {
                if (el) {
                    el.textContent = `₹${this.currentUser.walletBalance.toFixed(2)}`;
                }
            });
        }

        copyReferralLink() {
            const linkInput = document.getElementById('referral-link');
            if (!linkInput) return;

            try {
                linkInput.select();
                linkInput.setSelectionRange(0, 99999);
                document.execCommand('copy');
                this.showMessage('Referral link copied!', 'success');
            } catch (err) {
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(linkInput.value).then(() => {
                        this.showMessage('Referral link copied!', 'success');
                    });
                }
            }
        }

        showMessage(message, type = 'info') {
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--color-${type === 'success' ? 'success' : 'primary'});
                color: white;
                padding: 12px 24px;
                border-radius: 8px;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;

            document.body.appendChild(toast);
            setTimeout(() => toast.style.opacity = '1', 10);
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => document.body.removeChild(toast), 300);
            }, 3000);
        }
    }

    // Initialize app when DOM is ready
    function initApp() {
        window.app = new SportsBetApp();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
})();