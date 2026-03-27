const smartVineEngine = {
  wines: [
    { id: 'w1', name: 'Sangiovese', region: 'Tuscany', category: 'Red', traits: { tannin: 4, acidity: 5, sweetness: 1, body: 4 }, desc: 'High acidity, high tannin. Perfect for tomato-based dishes like pasta and pizza.' },
    { id: 'w2', name: 'Nebbiolo', region: 'Piedmont', category: 'Bold Red', traits: { tannin: 5, acidity: 5, sweetness: 1, body: 5 }, desc: 'Powerful, grippy tannins with floral notes. Best with truffles or rich meats.' },
    { id: 'w3', name: 'Barbera', region: 'Piedmont', category: 'Red', traits: { tannin: 2, acidity: 5, sweetness: 1, body: 3 }, desc: 'High acid but low tannin. Great for rich, cheesy pasta.' },
    { id: 'w4', name: 'Primitivo', region: 'Puglia', category: 'Bold Red', traits: { tannin: 3, acidity: 2, sweetness: 2, body: 5 }, desc: 'Jammy, full-bodied. Pairs with heavy meat ragù.' },
    { id: 'w5', name: 'Pinot Grigio', region: 'Veneto, Friuli', category: 'Crisp White', traits: { tannin: 0, acidity: 4, sweetness: 1, body: 2 }, desc: 'Light and crisp. Ideal for delicate seafood and fritto misto.' },
    { id: 'w6', name: 'Vermentino', region: 'Sardinia, Tuscany', category: 'Zesty White', traits: { tannin: 0, acidity: 4, sweetness: 1, body: 3 }, desc: 'Citrus and saline notes. Perfect with pesto or lemon seafood.' },
    { id: 'w7', name: 'Prosecco', region: 'Veneto', category: 'Sparkling', traits: { tannin: 0, acidity: 5, sweetness: 2, body: 2 }, desc: 'Bubbly and refreshing. Excellent aperitivo.' }
  ],
  foods: [
    { id: 'f1', name: 'Pizza Margherita / Tomato Pasta', needs: { tannin: 3, acidity: 5, sweetness: 0, body: 3 }, type: 'Classic Italian' },
    { id: 'f2', name: 'Carbonara / Risotto', needs: { tannin: 2, acidity: 5, sweetness: 0, body: 3 }, type: 'Rich & Creamy' },
    { id: 'f3', name: 'Osso Buco / Fiorentina Steak', needs: { tannin: 5, acidity: 4, sweetness: 0, body: 5 }, type: 'Heavy Meat' },
    { id: 'f4', name: 'Fritto Misto / Light Seafood', needs: { tannin: 0, acidity: 5, sweetness: 1, body: 2 }, type: 'Seafood' },
    { id: 'f5', name: 'Pesto alla Genovese', needs: { tannin: 0, acidity: 4, sweetness: 0, body: 3 }, type: 'Herbaceous' },
    { id: 'f6', name: 'Prosciutto / Salumi', needs: { tannin: 2, acidity: 5, sweetness: 1, body: 2 }, type: 'Aperitivo' }
  ],
  
  calculateScore(wineTraits, foodNeeds) {
    let score = 100;
    
    // Calculate differences
    const tDiff = Math.abs((wineTraits.tannin || 0) - (foodNeeds.tannin || 0));
    const aDiff = Math.abs((wineTraits.acidity || 0) - (foodNeeds.acidity || 0));
    const sDiff = Math.abs((wineTraits.sweetness || 0) - (foodNeeds.sweetness || 0));
    const bDiff = Math.abs((wineTraits.body || 0) - (foodNeeds.body || 0));
    
    // Penalties based on culinary rules
    score -= (tDiff * 6); // Tannin clash is heavily penalized
    score -= (aDiff * 4); // Acid balance is important
    score -= (sDiff * 7); // Sweetness balance is very critical
    score -= (bDiff * 3); // Body mismatch
    
    return Math.max(10, score);
  },
  
  getWinesForFood(foodId) {
    const food = this.foods.find(f => f.id === foodId);
    if (!food) return [];
    
    return this.wines.map(w => ({
      wine: w,
      score: Math.round(this.calculateScore(w.traits, food.needs))
    })).sort((a, b) => b.score - a.score);
  },
  
  getFoodsForWine(wineId) {
    const wine = this.wines.find(w => w.id === wineId);
    if (!wine) return [];
    
    return this.foods.map(f => ({
      food: f,
      score: Math.round(this.calculateScore(wine.traits, f.needs))
    })).sort((a, b) => b.score - a.score);
  }
};
