# node-dominos-france

Une API pour l'app Promos de Domino's Pizza

## Usage

```javascript
const Dominos = require('node-dominos-france');
const dominos = new Dominos();
```

### Get Stores

```javascript
dominos.getStores();
```

### Get store details

```javascript
dominos.getStoreDetails(storeId)
```

### Search for a store

```javascript
dominos.searchForStore(searchTerm)
```

### Get store vouchers

```javascript
dominos.getStoreVouchers(storeId)
```
