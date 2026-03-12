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
      date: new Date().toLocaleString(),
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
      ball.style.transform = 'translateY(20px) scale(0.5)';
      setTimeout(() => {
        ball.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        ball.style.opacity = '1';
        ball.style.transform = 'translateY(0) scale(1)';
      }, index * 100);
    });
  }

  getBallColor(num) {
    if (num <= 10) return 'var(--color-1-10)';
    if (num <= 20) return 'var(--color-11-20)';
    if (num <= 30) return 'var(--color-21-30)';
    if (num <= 40) return 'var(--color-31-40)';
    return 'var(--color-41-45)';
  }

  render() {
    const latest = this.history[0] || { numbers: [0, 0, 0, 0, 0, 0] };
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: 'Pretendard', sans-serif;
          max-width: 600px;
          margin: 2rem auto;
          padding: 1rem;
        }

        .card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        h1 {
          font-size: 2rem;
          color: #1a1a1a;
          margin-bottom: 2rem;
          font-weight: 700;
        }

        .balls-container {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .ball {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
          box-shadow: inset -4px -4px 10px rgba(0,0,0,0.2), 0 10px 20px rgba(0,0,0,0.1);
          text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
        }

        .generate-btn {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          border-radius: 12px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 10px 20px rgba(99, 102, 241, 0.3);
        }

        .generate-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4);
        }

        .generate-btn:active {
          transform: translateY(0);
        }

        .history-section {
          margin-top: 3rem;
          text-align: left;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .history-header h2 {
          font-size: 1.2rem;
          color: #4b5563;
        }

        .clear-btn {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          font-size: 0.9rem;
          text-decoration: underline;
        }

        .history-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
          container-type: inline-size;
        }

        .history-item {
          background: white;
          padding: 1rem;
          border-radius: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .history-date {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .history-numbers {
          display: flex;
          gap: 6px;
        }

        .small-ball {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          color: white;
          font-weight: 700;
        }

        @container (max-width: 400px) {
          .history-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      </style>
      
      <div class="card">
        <h1>Lucky Lotto</h1>
        <div class="balls-container">
          ${latest.numbers.map(num => `
            <div class="ball" style="background-color: ${num > 0 ? this.getBallColor(num) : '#e5e7eb'};">
              ${num > 0 ? num : '?'}
            </div>
          `).join('')}
        </div>
        <button class="generate-btn">행운의 번호 추출하기</button>

        <div class="history-section">
          <div class="history-header">
            <h2>최근 추출 기록</h2>
            ${this.history.length > 0 ? '<button class="clear-btn">전체 삭제</button>' : ''}
          </div>
          <ul class="history-list">
            ${this.history.map(item => `
              <li class="history-item">
                <span class="history-date">${item.date}</span>
                <div class="history-numbers">
                  ${item.numbers.map(num => `
                    <div class="small-ball" style="background-color: ${this.getBallColor(num)};">${num}</div>
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
