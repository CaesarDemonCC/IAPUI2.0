
class Table extends React.Component {
	constructor (props) {
	    super(props);

	    this.state = {
	    	data: props.dataSource,
	    	sort: {},
	    	selectedRow: null
	    };
	}

	componentDidMount () {
	    console.log('componentDidMount');
	}

  	componentWillReceiveProps (nextProps) {
  		console.log('componentWillReceiveProps');
  		if (nextProps.dataSource != this.props.dataSource) {
	      	this.setState({ data: nextProps.dataSource });
	    }
  	}

  	componentDidUpdate () {
    	console.log('componentDidUpdate');
  	}

  	createTitle () {
  		const title = this.props.title;
  		let titleContent = title;

  		if (title && title.render) {
			titleContent = title.render.call(this, title.text || '');
  		} 

  		return titleContent ? <div className="title_heading">{titleContent}</div> : '';
  	}

  	getSortClass (asc) {
  		const sortClassMapping = {0: 'down', 1: 'up'};

  		return sortClassMapping[asc];
  	}

  	onSort (col) {
  		const key = col.dataIndex;
  		const asc = this.state.sort.asc == undefined ? 1 : (this.state.sort.asc == 1 ? 0 : 1);

  		this.state.sort = {key: key, asc: asc};

  		this.setState({data:this.sortData(key, asc)});
  	}

  	onRowSelect (record) {
  		let rowKey = this.props.rowKey;
  		let selectedRow = this.state.selectedRow;
  		if (selectedRow && (selectedRow == record[rowKey])) {
  			selectedRow = null;
  		} else {
  			selectedRow = record[rowKey];
  		}
  		
  		this.setState({selectedRow});
  	}

  	getSelectedRow () {
  		return this.state.selectedRow;
  	}

  	getColumnKey (column, index) {
    	return column.key || column.dataIndex || index;
  	}

	createHeader () {
		const sortable = this.props.sortable ? 'sortable' : '';
		const sortObj = this.state.sort;
		let headers = [];

		this.props.columns.map((h, i) => {
			if (sortable) {
				//class="sort down"
				let sortClass = '';
				let clickFn = this.onSort.bind(this, h);

				if (sortObj && sortObj.key) {
					if (h.dataIndex == sortObj.key) {
						sortClass += 'sort ' + this.getSortClass(sortObj.asc);
					}
				}

				headers.push(<th className={sortClass} onClick={clickFn}>{h.name}</th>);
		    } else {
		    	headers.push(<th>{h.name}</th>);
		    }
			
		});

		return <thead className={sortable}><tr>{headers}</tr></thead>;
	}

	createCell (row, col, index) {
		const colKey = this.getColumnKey(col);
		let content = row[colKey] || '';
		
		if (col.render) {
			content = col.render.call(this, content, row, index);
		}

		return <td key={colKey}>{content}</td>;
	}

	createRow (row, cols, index) {
		let rowKey = this.props.rowKey;
		let onClickFn = this.onRowSelect.bind(this, row);
		let rowClass = this.state.selectedRow == row[rowKey] ? 'selected' : '';

		return <tr key={row[rowKey]} className={rowClass} onClick={onClickFn}>{cols}</tr>;
	}

	createBody (data) {
		let rows = data.map((d, i) => {
			let tds = [];
			this.props.columns.map((h, j) => {
				tds.push(this.createCell(d, h, j));
			});

			return this.createRow(d, tds, i);

		});
		
		return <tbody>{rows}</tbody>;
	}

	createFooter () {
		// TBD
	}

	sortData (key, asc) {
	    let data = this.props.dataSource;
	    data = data.sort(function(a, b) {
	      	var x = a[key];
	      	var y = b[key];
	      	if (asc) {
	        	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
	      	} else {
	        	return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	      	}
	    });

	    return data;
	}

	getData () {
		// TBD
		if (this.props.sortable && this.state.sort.key) {
			return this.sortData(this.state.sort.key, this.state.sort.asc); 
		} else {
			return this.props.dataSource;
		}
	}

	render () {
		const table = (
			<div className="table_wrapper">
				{this.createTitle()}
				<table className="data responsive">
					{this.createHeader()}
					{this.createBody(this.getData())}
					{this.createFooter()}
				</table>
			</div>
		);

		return (
			<div className="panel_wrapper">
				<div className="panel table rounded white no_pad">
	          		{table}
          		</div>
			</div>
		)
	}
} 

Table.defaultProps = {
	columns: [],
	dataSource: [],
	sortable: false,
	rowKey: 'name'
};

module.exports = Table;