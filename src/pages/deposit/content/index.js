import React, { Component } from 'react'
import { Card, Table, Button, Row, Col,message, Modal, DatePicker, Select, TimePicker} from 'antd'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import TableControl from '../../../components/table-control'
import columns from './columns'
import { DepositApi, UserApi } from '../../../api'
import { DEPOSIT_TYPES } from '../../../config/deposit'
import { DEPOSIT_REPORT_STATUS } from '../../../config/deposit'
import { generateUrlQueryParams, parseUrlQueryParams, compareParams } from '../../../utils/url-query-params'
import MENU from '../../../config/menu'
import { hasAccess } from '../../../utils/roles'
import { ROLES_ITEMS } from '../../../config/roles'
// import DepositReport from '../report'
import { numberToMoney } from '../../../utils/formatter/currency'
import { getError } from '../../../utils/error/api'
import dayjs from 'dayjs'
import './deposit-report.scss'

const formatTime = 'HH:mm';
const formatDate = 'DD-MM-YYYY';

class ClientDeposit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      size: 'large',
      data: [],
      count: 0,
      params: {
        page: 1,
        code: ''
      },
      datas: {
        action: DEPOSIT_REPORT_STATUS[0].code,
      },
      valPerPage: 0,
      selected: {},
      modal: false,
      modalData: {},
      client: {},
      total: {},
    }
  }
 
  componentDidMount() {
    const { location } = this.props
    this.getData(parseUrlQueryParams(location.search))
    this.getBalance()
    this.getClient()
  }

  componentDidUpdate(prevProps) {
    const { params, loading } = this.state
    const { location, action } = this.props
    if ((action && !loading && compareParams(prevProps.location, location, params)) || (!prevProps.action && action)) {
      this.getData(parseUrlQueryParams(location.search))
    }
  }

    //report

    clickSendReport = async () => {
      const { datas } = this.state
      const thisEl = this
      await this.setState({ ...this.state, loading: true })
      console.log(datas.action)
      Modal.confirm({
        title: 'Export Data Confirmation',
        content: 'This data will be downloaded to your device',
        onOk() {
          const payload = {
            filterType: 'period',
            action: datas.action,
            dateStart: datas.dateStart ? datas.dateStart.format('YYYY-MM-DD') : '',
            timeStart: datas.timeStart ? datas.timeStart.format('HH:mm') : '',
            dateEnd: datas.dateEnd ? datas.dateEnd.format('YYYY-MM-DD') : '',
            timeEnd: datas.timeEnd ? datas.timeEnd.format('HH:mm') : '',
          }
          DepositApi.exportData(payload)
          .then((res) => {
            message.success('Export data success')
            const dataExport = new Blob([res.data], { type: 'text/csv' })
              const csvURL = window.URL.createObjectURL(dataExport)
              const element = document.createElement('a')
              element.href = csvURL
              element.setAttribute('download', `export-deposit-${dayjs().format('YYYYMMDDHHmmssSSS')}.csv`)
              document.body.appendChild(element)
              element.click()
              document.body.removeChild(element)
            thisEl.setState({ ...thisEl.state, datas: { status: 'all' }, loading: false })
          })
          .catch((err) => {
            message.error(getError(err) || 'Export data failed')
            thisEl.setState({ ...thisEl.state, loading: false })
          })
        },
      })
    }
  
    changeInput = (value, field) => {
      const { datas } = this.state
      this.setState({ ...this.state, datas: { ...datas, [field]: value } });
    }

    changeDate = async (value, field) => {
      const { params, datas } = this.state
      let datefilter = value.format('YYYY-MM-DD')
      await this.setState({ ...this.state, datas: { ...datas, [field]: value } })
      this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, [field]: datefilter})
    }

    changeTime = async (value, field) => {
      const { params, datas } = this.state
      let datefilter = value.format('HH:mm')
      await this.setState({ ...this.state, datas: { ...datas, [field]: value } })
      this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, [field]: datefilter})
    }
  
    changeEndDate = async (value, field) => {
      const { params,datas } = this.state
      let datefilter = value.format('YYYY-MM-DD')
      await this.setState({ ...this.state, datas: { ...datas, [field]: value } })
      this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, [field]: datefilter})
    }

    changeEndTime = async (value, field) => {
      const { params, datas } = this.state
      let datefilter = value.format('HH:mm')
      await this.setState({ ...this.state, datas: { ...datas, [field]: value } })
      this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, [field]: datefilter})
    }

  changeModalDataStatus = (issuedStatus) => {
    const { modalData } = this.state
    this.setState({ ...this.state, modalData: { ...modalData, issuedStatus } })
  }

  changeModalDataReference = (e) => {
    const { modalData } = this.state
    this.setState({ ...this.state, modalData: { ...modalData, voucher: e.target.value } })
  }


  openModal = (selected) => {
    this.setState({ ...this.state, modal: true, selected })
  }

  closeModal = () => {
    this.setState({ ...this.state, modal: false, selected: {}, modalData: {} })
  }

  getData = async (params = this.state.params) => {
    await this.setState({ ...this.state, loading: true })
    if (params.action === '') delete params.action

    try {
      let res = await DepositApi.get(params)
      const data = res.data
      this.setState({
        ...this.state,
        data: data || [],
        count: res.data.count,
        loading: false,
        params,
        valPerPage: (data || []).length,
      })
    }catch(e) {
      this.setState({ ...this.state, loading: false })
    }
  }

  getBalance = () => {
    DepositApi.getBalance()
    .then(res => {
      const balance = res.data.balance;
      this.setState({ balance });
    })
  .catch(() => {
    this.setState({ ...this.state, loading: false })
  })
}

getClient = () => {
  UserApi.get()
  .then((res) => {
    this.setState({
      ...this.state,
      client: {
        ...res.data.Client
      },
    })
  })
  .catch(() => {
    this.setState({ ...this.state, loading: false })
  })
}

clientID = () => {
  const { client } = this.state
  this.setState({...this.state, total:{...client.id}, })
}

  changeFilter = (value, field) => {
    const { params } = this.state
    let paramfilter = value
    if(value=="all"){
      paramfilter=""
    }
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, [field]: paramfilter })
  }

  changeSearch = (e) => {
    const { value } = e.target
    const { params } = this.state
    if (value) {
      this.setState({ ...this.state, params: { ...params, page: 1, code: value } })
    } else {
      this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, code: '' })
    }
  }

  search = (searchValue) => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, code: searchValue })
  }

  handlePrevPage = () => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: params.page - 1 })
  }

  handleNextPage = () => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: params.page + 1 })
  }

  addUrlQueryParamsAndUpdateData = (params) => {
    this.addUrlQueryParams(params)
    this.getData(params)
  }

  addUrlQueryParams = (params,type) => {
    const { history} = this.props
    const query = generateUrlQueryParams(params)
    history.push(`${MENU.DEPOSIT}/client?${query}`)
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
   
  handleOke = (e) => {
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }


  render() {
    const { loading, data, params, valPerPage, balance, client, datas} = this.state
    // const { type } = this.props

    return (
      <div>
        {/* {this.clientID()}      */}
        <TableControl
          search={this.search}
          valPage={params.page}
          valPerPage={valPerPage}
          handlePrevPage={this.handlePrevPage}
          handleNextPage={this.handleNextPage}
          loading={loading}
          searchText='Order ID'
          // disableSearch={type === DEPOSIT_TYPES.PROVIDERS}
          searchValue={params.code}
          changeSearch={this.changeSearch}
        />
        <Row>
          <Col span={24}>
            <div className="app-actions__right">
              <span className="total">Total Deposit</span>
              <div className="top-up">{numberToMoney(balance)}</div>
              <Button htmlType="submit" className="top-up" onClick={this.showModal} loading={loading} type="primary">TOP UP</Button>
              <Modal
                title="Top Up Information"
                visible={this.state.visible}
                onOk={this.handleOke}
                onCancel={this.handleCancel}
              >
                <p>1. Client diharapkan melakukan setoran ke salah satu rekening Billfazz yang tertera dibawah ini:</p>
                <p>*BRI 4300-1000-650-307 A.N PT.Billfazz Teknologi Nusantara</p>
                <p>*BCA 501-579-0781 A.N PT.Billfazz Teknologi Nusantara</p>
                <p>2. Nominal deposit diharapkan disesuaikan juga dengan kode setoran yang berupa client ID [{client.id}].</p>
                <p>contoh</p>
                <p>Anda ingin menyetor deposit Rp.100.000.000</p>
                <p>*  Client ID [{client.id}]</p>
                <p>*  Total yang disetorkan:* Rp.100.000.00{client.id}</p>
                <p>3. Masukan "Deposit{client.name}" di keterangan transfer.></p>
                <p>4. Konfirmasi manual dengan mengirimkan bukti transfer melalui grup customer service Billfazz, cc: Finance Billfazz.</p>
                <p>5. Deposit dilakukan dimulai dari pukul 07.00 dan paling lambat pukul 21.00 setiap harinya</p>
              </Modal>
            </div>
          </Col>
        </Row>

        <div className="order-report">
        <Card>
          <div className="order-report__content">
            <div className="flex">
              <div className="filter-block">
                <label className="small-text">Operation:</label>
                <div>
                  <Select defaultValue="All Status" className="filter-input" onChange={e => this.changeFilter(e, 'action')}>
                    {
                      DEPOSIT_REPORT_STATUS.map(action => (
                        <Select.Option key={action.code} onChangeValue={action.filter} value={action.code}>{action.name}</Select.Option>
                      ))
                    }
                  </Select>
                </div>
              </div>
              <div className="filter-block">
                <label className="small-text">Date:</label>
                <div>
                  <DatePicker className="filter-input" format={formatDate} value={datas.dateStart} onChange={e => this.changeDate(e, 'dateStart')} />
                </div>
              </div>
              <div className="filter-block">
                <label className="small-text">Time:</label>
                <div>
                  <TimePicker className="filter-input" format={formatTime} disabled={!(datas.dateStart)} value={datas.timeStart} onChange={e => this.changeTime(e, 'timeStart')} />
                </div>
              </div>
              <div className="filter-block" style={{ marginTop: '26px' }}>
                To
              </div>
              <div className="filter-block">
                <label className="small-text">Date:</label>
                <div>
                  <DatePicker className="filter-input" format={formatDate} disabled={!(datas.timeStart)} value={datas.dateEnd} onChange={e => this.changeEndDate(e, 'dateEnd')} />
                </div>
              </div>
              <div className="filter-block">
                <label className="small-text">Time:</label>
                <div>
                  <TimePicker className="filter-input" format={formatTime} disabled={!(datas.dateEnd)} value={datas.timeEnd} onChange={e => this.changeEndTime(e, 'timeEnd')} />
                </div>
              </div>
            </div>
            <Button
              className="btn-oval"
              type="primary"
              loading={loading}
              onClick={this.clickSendReport}
              disabled={!(datas.dateStart && datas.dateEnd && datas.timeStart && datas.timeEnd)}
            >
              EXPORT DATA
            </Button>
          </div>
        </Card>
      </div>
        
        <Card>
          <Table
            className="table-responsive"
            loading={loading}
            rowKey="createdAt"
            dataSource={data}
            columns={columns}
            pagination={false}
          />
        </Card>
      </div>
    )
  }
}

ClientDeposit.propTypes = {
  // type: PropTypes.string.isRequired,
  // action: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withRouter(ClientDeposit)
