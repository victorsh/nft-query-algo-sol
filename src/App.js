import logo from './logo.svg';
import './App.css';
import axios from 'axios';


const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        NFTS
      </header>
    </div>
  );
}

// public-api.solscan.io/
// https://api.solscan.io
// https://algoexplorer.io/api-dev/indexer-v2
// https://www.nftexplorer.app/asset/701093168

const algo_nft_owners = async () => {
  let res = await axios.get('https://indexer.algoexplorerapi.io/rl/v1/transactions?asset-id=701093168')
  let holders = {}
  let creator = ''
  res.data.transactions.forEach(tx => {
    console.log(tx)
    if (typeof tx['asset-transfer-transaction'] !== 'undefined') {
      holders[tx['asset-transfer-transaction']['receiver']] = tx['asset-transfer-transaction']['receiver']
    }
    if (typeof tx['asset-config-transaction'] !== 'undefined') {
      creator = tx['asset-config-transaction']['params']['creator']
    }
  })

  for (let h in holders) {
    console.log(h)
    let res = await axios.get('https://algoindexer.algoexplorerapi.io/v2/accounts/E5CCRZX5NP23STYZSE2JIOWD3TKW4CNLGOP4Q57KE2VCSTCJOVEHKMBS6A')
    console.log(res)
    res.data.account.assets.forEach(asset => {
      console.log(asset)
    })
  }

  console.log(creator)
}

const algo_get_asset = async () => {
  let res = await axios.get('https://algoindexer.algoexplorerapi.io/v2/assets/701093168')
  console.log(res.data.asset.params)
}

const algo_asset_txns = async () => {
  let res = await axios.get('https://algoindexer.algoexplorerapi.io/v2/assets/701093168/transactions')
  let asset_creation = res.data.transactions[0]
  let creator = asset_creation['asset-config-transaction']['params']['creator']

  let history = []
  let addresses = {}
  res.data.transactions.forEach(tx => {
    if (typeof tx['asset-transfer-transaction'] !== 'undefined') {
      if (tx['asset-transfer-transaction']['amount'] !== 0) {
        history.push([tx['sender'], tx['asset-transfer-transaction']['receiver'], tx['asset-transfer-transaction']['amount']])
        if (typeof addresses[tx['sender']] === 'undefined') {
          addresses[tx['sender']] = 1
        }
        if (typeof addresses[tx['asset-transfer-transaction']['receiver']] === 'undefined') {
          addresses[tx['asset-transfer-transaction']['receiver']] = 1
        }
      }
    }
  })

  const holders = []
  for (const address in addresses) {
    let acct_info = null
    try {
      acct_info = await axios.get(`https://algoindexer.algoexplorerapi.io/v2/accounts/${address}`)
    } catch(err) {
      // console.log(err)
      console.clear()
    }

    if (acct_info !== null) {
      for (let asset in acct_info.data.account.assets) {
        asset = acct_info.data.account.assets[asset]
        if (asset['asset-id'] === 701093168 && asset['amount'] > 0) {
          holders.push([address, asset['amount']])
        }
      }
    }
  }

  console.log(holders)
}

const sol_get_tokens = async () => {
  let res = await axios.get('https://public-api.solscan.io/account/tokens?account=FsjmGRLZNfTUfJz5AegDRxgYFyhGqQwVHPS3Pi3jEQgo')
  
  console.log(res.data)
}

const sol_get_token_holders = async () => {
  let res = await axios.get('https://public-api.solscan.io/token/holders?tokenAddress=4FFTTwc8uudqoUmWycn6HUggTCoTkvjDRP9z7NmmpG3q')
  console.log(res.data)
}

const sol_get_token_meta = async () => {
  let res = await axios.get('https://public-api.solscan.io/token/meta?tokenAddress=4FFTTwc8uudqoUmWycn6HUggTCoTkvjDRP9z7NmmpG3q')
  console.log(res.data)
}

const sol_get_nft_data = async () => {
  let res = await axios.get('https://api.solscan.io/transfer/token?token_address=4FFTTwc8uudqoUmWycn6HUggTCoTkvjDRP9z7NmmpG3q&type=all&offset=0&limit=10&cluster=')
  console.log(res.data)
}

const sol_get_nft_detail = async () => {
  let res = await axios.get('https://api.solscan.io/nft/detail?mint=4FFTTwc8uudqoUmWycn6HUggTCoTkvjDRP9z7NmmpG3q&cluster=')
  console.log(res.data)
}

// !!! This method will return token info and metadata
const sol_get_nft_metadata = async () => {
  let res = await axios.get('https://api.solscan.io/account?address=4FFTTwc8uudqoUmWycn6HUggTCoTkvjDRP9z7NmmpG3q&cluster=')
  console.log(res.data.data.metadata)
  console.log(res.data.data.tokenInfo)
}

const sol_get_collection = async () => {
  let res = await axios.get('https://api.solscan.io/collection/nft?sortBy=nameDec&collectionId=0f60da652811994d2466073d30ee22976f545739b92aeb08a27aa5db03898b61&offset=0&limit=20&cluster=')
  let nfts = res.data.data
  for (let nft in nfts) {
    // Address
    console.log(nfts[nft].info.mint)
    // NFT info (URI)
    console.log(nfts[nft].info.data)
    // Description, External link
    console.log(nfts[nft].info.meta)
  }
}

// algo_nft_owners()
// algo_get_asset()
// algo_asset_txns()
// sol_get_tokens()
// sol_get_token_holders()
// sol_get_token_meta()
// sol_get_nft_data()
// sol_get_nft_detail()
sol_get_nft_metadata()
// sol_get_collection()
export default App;
