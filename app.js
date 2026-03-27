const app = {
  navigate(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    if (viewId === 'view-food') {
      this.renderFoodList();
    } else if (viewId === 'view-wine') {
      this.renderWineList();
    }
  },
  
  renderFoodList() {
    const view = document.getElementById('view-food');
    view.innerHTML = `
      <button class="back-btn" onclick="app.navigate('view-home')">← Back</button>
      <h2>Italian Cuisine</h2>
      <div class="list-group">
        ${smartVineEngine.foods.map(f => `
          <div class="list-item" onclick="app.showWinesForFood('${f.id}')">
            <div class="item-text">
              <h4>${f.name}</h4>
            </div>
            <span class="chevron">›</span>
          </div>
        `).join('')}
      </div>
    `;
  },
  
  renderWineList() {
    const view = document.getElementById('view-wine');
    view.innerHTML = `
      <button class="back-btn" onclick="app.navigate('view-home')">← Back</button>
      <h2>Italian Wines</h2>
      <div class="list-group">
        ${smartVineEngine.wines.map(w => `
          <div class="list-item" onclick="app.showFoodsForWine('${w.id}')">
            <div class="item-text">
              <h4>${w.name}</h4>
              <p>${w.region} • ${w.category}</p>
            </div>
            <span class="chevron">›</span>
          </div>
        `).join('')}
      </div>
    `;
  },
  
  showWinesForFood(foodId) {
    const food = smartVineEngine.foods.find(f => f.id === foodId);
    const results = smartVineEngine.getWinesForFood(foodId).slice(0, 3);
    
    const view = document.getElementById('view-food');
    view.innerHTML = `
      <button class="back-btn" onclick="app.renderFoodList()">← Back</button>
      <h2>Matches for ${food.name}</h2>
      <div class="results-container">
        ${results.map(r => `
          <div class="result-card ${r.score >= 85 ? 'top-match' : ''}">
            <div class="score-badge">${r.score}% Match</div>
            <h3>${r.wine.name}</h3>
            <span class="wine-type">${r.wine.region} • ${r.wine.category}</span>
            <p>${r.wine.desc}</p>
          </div>
        `).join('')}
      </div>
    `;
  },
  
  showFoodsForWine(wineId) {
    const wine = smartVineEngine.wines.find(w => w.id === wineId);
    const results = smartVineEngine.getFoodsForWine(wineId).slice(0, 3);
    
    const view = document.getElementById('view-wine');
    view.innerHTML = `
      <button class="back-btn" onclick="app.renderWineList()">← Back</button>
      <h2>Pairs with ${wine.name}</h2>
      <div class="results-container">
        ${results.map(r => `
          <div class="result-card ${r.score >= 85 ? 'top-match' : ''}">
            <div class="score-badge">${r.score}% Match</div>
            <h3>${r.food.name}</h3>
            <span class="wine-type">${r.food.type}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
};

// Enable "Add to Home Screen" PWA setup logic here in the future
document.addEventListener("DOMContentLoaded", async () => {
  await smartVineEngine.loadWines();
  console.log("WineMaster UI Ready.");
});
