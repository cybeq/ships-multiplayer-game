export default class {
    api = undefined
    data = [
        {
            id: "3123"
        }
    ]
    columns = [
        {
            headerName: 'PLAYER_ID',
            field: 'id',
            flex: 1,
            headerClass: 'ag-right-aligned-header',
            cellStyle: params => {
                return {
                    textAlign: 'right'
                }
            }
        },
        {
            headerName: 'Status',
            field: 'status',
            flex: 1,
            cellStyle: params => {
                return {
                    textAlign: 'left',
                    color: params.data.inGame ? 'red' : 'darkgreen'
                }
            },
            valueGetter: params => {
                console.log('player.id', params.data)
                return `${params.data.inGame ? 'IN GAME' : 'FREE'}`
            }
        },
        {
            headerName: 'Play',
            field: 'play',
            flex: 1,
            cellStyle: params => {
                return {
                    textAlign: 'left',
                    border: 'solid 1px #00000020',
                    background: '#00000020',
                    cursor: 'pointer'
                }
            },
            valueGetter: params => {
                return "🕹"
            }
        }
    ]
    options = {
        onGridReady: params => {
            this.api = params.api;
            this?.api?.setRowData(this.data)
        }

    }
}
