class LottoApp extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.history = JSON.parse(localStorage.getItem('lotto-history')) || [];
  }

  connectedCallback() {
    this.render();
  }

  generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
    this.history.unshift({
      date: new Date().toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      numbers: sortedNumbers
    });
    if (this.history.length > 10) this.history.pop();
    localStorage.setItem('lotto-history', JSON.stringify(this.history));
    this.render();
    this.animateBalls();
  }

  clearHistory() {
    if (confirm('전체 기록을 삭제하시겠습니까?')) {
      this.history = [];
      localStorage.removeItem('lotto-history');
      this.render();
    }
  }

  animateBalls() {
    const balls = this.shadowRoot.querySelectorAll('.ball');
    balls.forEach((ball, index) => {
      ball.style.opacity = '0';
      ball.style.transform = 'translateY(30px) scale(0.8)';
      setTimeout(() => {
        ball.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        ball.style.opacity = '1';
        ball.style.transform = 'translateY(0) scale(1)';
      }, index * 120);
    });
  }

  getBallColorVar(num) {
    if (num <= 10) return '--ball-1-10';
    if (num <= 20) return '--ball-11-20';
    if (num <= 30) return '--ball-21-30';
    if (num <= 40) return '--ball-31-40';
    return '--ball-41-45';
  }

  render() {
    const latest = this.history[0] || { numbers: [0, 0, 0, 0, 0, 0] };
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Pretendard', sans-serif;
          max-width: 500px;
          width: 100%;
          margin: 0 auto;
        }

        .card {
          background: rgba(17, 24, 39, 0.7); /* Darker glass */
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-radius: 28px;
          padding: 3rem 2rem;
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.5), 
            0 0 0 1px rgba(255, 255, 255, 0.1) inset,
            0 0 20px rgba(124, 58, 237, 0.15); /* Subtle purple glow */
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        /* Decorative top gradient line */
        .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent);
        }

        h1 {
          font-size: 1.8rem;
          color: #ffffff;
          margin-bottom: 2.5rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }
        
        h1 span {
          font-weight: 700;
          background: linear-gradient(135deg, #fbbf24, #d97706);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .balls-container {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 3rem;
          flex-wrap: wrap;
          padding: 0 0.5rem;
        }

        .ball {
          width: 54px;
          height: 54px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 1.3rem;
          position: relative;
          z-index: 1;
          /* 3D Glassy/Metallic Look */
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 20%),
                      linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.2));
          box-shadow: 
            0 10px 20px rgba(0,0,0,0.3),
            0 4px 6px rgba(0,0,0,0.1),
            inset 0 -5px 10px rgba(0,0,0,0.2);
          text-shadow: 0 2px 4px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.15);
        }

        .ball::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          padding: 2px; /* Border width */
          background: linear-gradient(180deg, rgba(255,255,255,0.4), transparent); 
          -webkit-mask: 
             linear-gradient(#fff 0 0) content-box, 
             linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }

        /* Number styles inside ball */
        .ball span {
          z-index: 2;
        }

        /* Fallback color if var not found */
        .ball-bg {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          z-index: -1;
        }

        .generate-btn {
          background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
          color: white;
          border: none;
          padding: 1.1rem 3rem;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 50px; /* Pill shape */
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 
            0 4px 15px rgba(139, 92, 246, 0.4),
            inset 0 1px 0 rgba(255,255,255,0.2);
          letter-spacing: 0.05em;
          position: relative;
          overflow: hidden;
        }

        .generate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 
            0 8px 25px rgba(139, 92, 246, 0.5),
            inset 0 1px 0 rgba(255,255,255,0.2);
          filter: brightness(1.1);
        }

        .generate-btn:active {
          transform: translateY(1px);
        }
        
        /* Shine effect on button */
        .generate-btn::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: skewX(-20deg);
          transition: 0.5s;
        }
        
        .generate-btn:hover::after {
          left: 150%;
          transition: 0.7s;
        }

        .history-section {
          margin-top: 3.5rem;
          text-align: left;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 2rem;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .history-header h2 {
          font-size: 1rem;
          color: #94a3b8;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .clear-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          font-size: 0.85rem;
          transition: color 0.2s;
        }
        
        .clear-btn:hover {
          color: #ef4444; /* Red on hover */
        }

        .history-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .history-item {
          background: rgba(255, 255, 255, 0.03);
          padding: 0.8rem 1rem;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: background 0.2s;
        }
        
        .history-item:hover {
          background: rgba(255, 255, 255, 0.06);
        }

        .history-date {
          font-size: 0.85rem;
          color: #64748b;
          font-variant-numeric: tabular-nums;
        }

        .history-numbers {
          display: flex;
          gap: 6px;
        }

        .small-ball {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          color: white;
          font-weight: 700;
          /* Simplified style for small balls */
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
        }

        @media (max-width: 480px) {
           .ball {
             width: 45px;
             height: 45px;
             font-size: 1.1rem;
           }
           
           .history-item {
             flex-direction: column;
             align-items: flex-start;
             gap: 8px;
           }
           
           .history-numbers {
             width: 100%;
             justify-content: flex-start;
           }
        }
      </style>
      
      <div class="card">
        <h1>Lucky <span>Lotto</span></h1>
        <div class="balls-container">
          ${latest.numbers.map(num => `
            <div class="ball">
              <div class="ball-bg" style="background-color: var(${num > 0 ? this.getBallColorVar(num) : '--text-secondary'}); opacity: ${num > 0 ? 1 : 0.2};"></div>
              <span>${num > 0 ? num : '?'}</span>
            </div>
          `).join('')}
        </div>
        <button class="generate-btn">행운번호 추출</button>

        <div class="history-section">
          <div class="history-header">
            <h2>History</h2>
            ${this.history.length > 0 ? '<button class="clear-btn">Clear All</button>' : ''}
          </div>
          <ul class="history-list">
            ${this.history.map(item => `
              <li class="history-item">
                <span class="history-date">${item.date}</span>
                <div class="history-numbers">
                  ${item.numbers.map(num => `
                    <div class="small-ball" style="background-color: var(${this.getBallColorVar(num)});">
                      ${num}
                    </div>
                  `).join('')}
                </div>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.generate-btn').addEventListener('click', () => this.generateNumbers());
    const clearBtn = this.shadowRoot.querySelector('.clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => this.clearHistory());
    }
  }
}

customElements.define('lotto-app', LottoApp);
