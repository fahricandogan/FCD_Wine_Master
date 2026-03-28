const smartVineEngine = {
  mode: 'italian',
  italianWines: [],
  frenchWines: [],
  
  get wines() {
    return this.mode === 'italian' ? this.italianWines : this.frenchWines;
  },

  async loadWines() {
    try {
      const [itRes, frRes] = await Promise.all([
        fetch('./Wines.json'),
        fetch('./FrenchWines.json')
      ]);
      this.italianWines = await itRes.json();
      this.frenchWines = await frRes.json();
    } catch (error) {
      console.error('Failed to load wines data:', error);
    }
  },
  
  italianFoods: [
    { id: 'f1', name: 'Pizza Margherita / Tomato Pasta', needs: { tannin: 3, acidity: 5, sweetness: 0, body: 3 }, type: 'Classic Italian' },
    { id: 'f2', name: 'Carbonara / Risotto', needs: { tannin: 2, acidity: 5, sweetness: 0, body: 3 }, type: 'Rich & Creamy' },
    { id: 'f3', name: 'Osso Buco / Fiorentina Steak', needs: { tannin: 5, acidity: 4, sweetness: 0, body: 5 }, type: 'Heavy Meat' },
    { id: 'f4', name: 'Fritto Misto / Light Seafood', needs: { tannin: 0, acidity: 5, sweetness: 1, body: 2 }, type: 'Seafood' },
    { id: 'f5', name: 'Pesto alla Genovese', needs: { tannin: 0, acidity: 4, sweetness: 0, body: 3 }, type: 'Herbaceous' },
    { id: 'f6', name: 'Prosciutto / Salumi', needs: { tannin: 2, acidity: 5, sweetness: 1, body: 2 }, type: 'Aperitivo' }
  ],

  frenchFoods: [
    { id: 'ff1', name: 'Steak Frites', needs: { tannin: 4, acidity: 3, sweetness: 0, body: 4 }, type: 'Classic Meat' },
    { id: 'ff2', name: 'Duck Confit', needs: { tannin: 3, acidity: 4, sweetness: 0, body: 4 }, type: 'Rich Poultry' },
    { id: 'ff3', name: 'Boeuf Bourguignon', needs: { tannin: 4, acidity: 4, sweetness: 0, body: 5 }, type: 'Heavy Meat Stew' },
    { id: 'ff4', name: 'Coq au Vin', needs: { tannin: 3, acidity: 4, sweetness: 0, body: 4 }, type: 'Poultry in Wine' },
    { id: 'ff5', name: 'French Onion Soup', needs: { tannin: 2, acidity: 3, sweetness: 1, body: 3 }, type: 'Rich Broth/Cheese' },
    { id: 'ff6', name: 'Escargots de Bourgogne', needs: { tannin: 1, acidity: 4, sweetness: 0, body: 2 }, type: 'Garlic/Butter' },
    { id: 'ff7', name: 'Croque Monsieur', needs: { tannin: 1, acidity: 4, sweetness: 0, body: 3 }, type: 'Cheese/Ham/Bread' },
    { id: 'ff8', name: 'Salade Niçoise', needs: { tannin: 0, acidity: 5, sweetness: 0, body: 2 }, type: 'Tuna/Egg/Veg' },
    { id: 'ff9', name: 'Quiche Lorraine', needs: { tannin: 1, acidity: 3, sweetness: 0, body: 3 }, type: 'Egg/Bacon/Pastry' },
    { id: 'ff10', name: 'Ratatouille', needs: { tannin: 2, acidity: 4, sweetness: 0, body: 3 }, type: 'Tomato/Veg' },
    { id: 'ff11', name: 'Bouillabaisse', needs: { tannin: 0, acidity: 4, sweetness: 0, body: 3 }, type: 'Fish Stew' },
    { id: 'ff12', name: 'Sole Meunière', needs: { tannin: 0, acidity: 5, sweetness: 0, body: 2 }, type: 'Delicate Fish' },
    { id: 'ff13', name: 'Cassoulet', needs: { tannin: 4, acidity: 3, sweetness: 0, body: 5 }, type: 'Rich Meat/Bean' },
    { id: 'ff14', name: 'Moules Marinières', needs: { tannin: 0, acidity: 5, sweetness: 0, body: 2 }, type: 'Mussels/White Wine' },
    { id: 'ff15', name: 'Tarte Tatin', needs: { tannin: 1, acidity: 3, sweetness: 5, body: 4 }, type: 'Sweet Apple' }
  ],

  get foods() {
    return this.mode === 'italian' ? this.italianFoods : this.frenchFoods;
  },
  
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
