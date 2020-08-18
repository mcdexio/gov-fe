# gov-fe

The MCDEX Governance voting app UI.

Interfaced with:

- The Governance voting smart contracts ([repo](https://github.com/mcdexio/vote-protocol))
- The Governance voting backend ([repo](https://github.com/mcdexio/gov-be))

# To Do

- [x] Add new proposal requirements check (ex: enough MCB?)
- [x] Add new vote requirements check (ex: already voted?)
- [x] Add loading on new vote
- [x] Warn if wallet is connected but not on Mainnet
- [ ] Add responsivness
- [ ] Add support for Coinbase Wallet (Wallet Link)
- [ ] Display future timestamp instead of Block number

# Test

```bash
npm start
```

# Build for production

```bash
npm run build
```
