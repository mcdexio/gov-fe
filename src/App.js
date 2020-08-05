import React from 'react';
import './App.css';

import Provider from './thegraph/Provider';
import Query    from './thegraph/Query';
import overview from './thegraph/query/overview';



const Process = (props) =>
	<ul>
	{
		props.data.pairs.map(pair =>
			<li key={pair.id}>
				{ pair.asset_base.id } → { pair.asset_quote.id }
				<ul>
				{
					pair.history.map(quotation =>
						<li key={quotation.id}>
							{ Date(quotation.timestamp).toString() } - { quotation.value }
						</li>
					)
				}
				</ul>
			</li>
		)
	}
	</ul>

const App = () =>
	<div className="App">
		<Provider uri='https://api.thegraph.com/subgraphs/name/amxx/price-feed-doracle-goerli'>
			<Query query={ overview }>
				<Process/>
			</Query>
		</Provider>
	</div>

export default App;
