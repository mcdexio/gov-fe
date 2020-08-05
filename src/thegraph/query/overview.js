import gql from 'graphql-tag';

export default gql`
{
	pairs(first: 1000)
	{
		id
		asset_base  { id }
		asset_quote { id }
		precision
		latest
		{
			id
			value
			timestamp
		}
		history(first:100, orderBy: timestamp, orderDirection: desc)
		{
			id
			value
			timestamp
		}
	}
}
`
