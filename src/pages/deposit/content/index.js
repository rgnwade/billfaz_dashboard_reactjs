import React, { Component } from 'react'
import { Card, Table, message, Button, Row, Col, Modal} from 'antd'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
// import { OPTIONS_CONFIG_DEPOSIT } from '../../../config/options'
import TableControl from '../../../components/table-control'
// import moment from 'moment'
// import Filter from '../../../components/filter'
import columns from './columns'
import { DepositApi } from '../../../api'
// import TopupModal from '../modal'
// import { moneyToNumber } from '../../../utils/formatter/currency'
import { getErrorMessage } from '../../../utils/error/api'
import { DEPOSIT_TYPES } from '../../../config/deposit'
import { generateUrlQueryParams, parseUrlQueryParams, compareParams } from '../../../utils/url-query-params'
import MENU from '../../../config/menu'
import { hasAccess } from '../../../utils/roles'
import { ROLES_ITEMS } from '../../../config/roles'
import DepositReport from '../report'
import { numberToMoney } from '../../../utils/formatter/currency'


class FormExport extends Component {
  constructor(props) {
    super(props)
    this.state = {
      action: '',
      dateStart: '',
      timeStart: '',
      dateEnd: '',
      timeEnd: '',
    }
  }
  changeAction = e => this.setState({ action: e.target.value })

  changeDateStart = e => this.setState({ dateStart: e.target.value })

  changeTimeStart = e => this.setState({ timeStart: e.target.value })

  changeDateEnd= e => this.setState({ dateEnd: e.target.value })

  changeTimeEnd = e => this.setState({ timeEnd: e.target.value })


  submitExport = async (e) => {
    e.preventDefault()
    await this.setState({ ...this.state, loading: true })
    const { action, dateStart, timeStart, dateEnd, timeEnd  } = this.state
    const ex = await DepositApi.exportData({ action, dateStart, timeStart, dateEnd, timeEnd} )
      .then((res) => {
        return res.data.ex
      })
      .catch((err) => {
        this.setState({ ...this.state, loading: false })
        message.error(getErrorMessage(err) || 'Export Failed')
        return false
      })
    if (ex) {
      await this.getPermission()
      this.props.history.push(MENU.ORDER)
    }
  }
}

// const Option = Select.Option;
// function handleChange(value) {
//   console.log(`selected ${value}`);
// }

// const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
// function onChange(date, dateString) {
//   console.log(date, dateString);
// }

// const format = 'HH:mm';

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
      },
      valPerPage: 0,
      selected: {},
      modal: false,
      modalData: {},
    }
  }

 
  componentDidMount() {
    const { location } = this.props
    this.getData(parseUrlQueryParams(location.search))
    this.getBalance()
  }

  componentDidUpdate(prevProps) {
    const { params, loading } = this.state
    const { location, active } = this.props
    if ((active && !loading && compareParams(prevProps.location, location, params)) || (!prevProps.active && active)) {
      this.getData(parseUrlQueryParams(location.search))
    }
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
    const { type } = this.props
    await this.setState({ ...this.state, loading: true })
    if (params.action === '') delete params.action
    DepositApi.get(type, params)
      .then((res) => {
        const data = res.data
        this.setState({
          ...this.state,
          data: data || [],
          count: res.data.count,
          loading: false,
          params,
          valPerPage: (data || []).length,
        })
      })
      .catch(() => {
        this.setState({ ...this.state, loading: false })
      })
  }

  getBalance = () => {
    DepositApi.getBalance()
    .then(res => {
      console.log(res)
      const balance = res.data.balance;
      this.setState({ balance });
    })
  .catch(() => {
    this.setState({ ...this.state, loading: false })
  })
}


  changeFilter = (value, field) => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, [field]: value })
  }

  changeSearch = (e) => {
    const { value } = e.target
    const { params } = this.state
    if (value) {
      this.setState({ ...this.state, params: { ...params, page: 1, searchQuery: value } })
    } else {
      this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, searchQuery: '' })
    }
  }

  search = (searchValue) => {
    const { params } = this.state
    this.addUrlQueryParamsAndUpdateData({ ...params, page: 1, searchQuery: searchValue })
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

  addUrlQueryParams = (params) => {
    const { history, type } = this.props
    const query = generateUrlQueryParams(params)
    history.push(`${MENU.DEPOSIT}/${type}?${query}`)
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }
   
  handleOke = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }


  render() {

    const { loading, data, params, valPerPage, balance} = this.state
    const { type } = this.props
 
      
    return (
      <div>
     
        <TableControl
          search={this.search}
          valPage={params.page}
          valPerPage={valPerPage}
          handlePrevPage={this.handlePrevPage}
          handleNextPage={this.handleNextPage}
          loading={loading}
          searchText={type === DEPOSIT_TYPES.CLIENTS ? 'Order ID' : 'Provider Name'}
          disableSearch={type === DEPOSIT_TYPES.PROVIDERS}
          searchValue={params.searchQuery}
          changeSearch={this.changeSearch}
        />
       
       <Row>
       <Col span={24}>
          
            <div className="app-actions__right">
              <a className="total">Total Deposit</a>
              <div className="top-up">{numberToMoney(balance)}
              </div>
              <Button htmlType="submit" className="top-up" onClick={this.showModal} loading={loading} type="primary">TOP UP</Button>
                <Modal
          title="Top Up Information"
          visible={this.state.visible}
          onOke={this.handleOke}
          onCancel={this.handleCancel}
        >
          <p>1. Client diharapkan melakukan setoran ke salah satu rekening Billfazz yang tertera dibawah ini:</p>
          <p>*BRI 4300-1000-650-307 A.N PT.Billfazz Teknologi Nusantara</p>
          <p>*BCA 501-579-0781 A.N PT.Billfazz Teknologi Nusantara</p>
          <p>2. Nominal deposit diharapkan disesuaikan juga dengan kode setoran yang berupa client ID (*12).</p>
          <p>contoh</p>
          <p>Anda ingin menyetor deposit Rp.100.000.000</p>
          <p>*  Clien ID: 12*</p>
          <p>*  Total yang disetorkan: Rp.  100.000.012*</p>
          <p>3. Masukan "Deposit(Nama Client)" di keterangan transfer.></p>
          <p>4. Konfirmasi manual dengan mengirimkan bukti transfer melalui grup customer service Billfazz, cc: Finance Billfazz.</p>
          <p>5. Deposit dilakukan paling lambat pukul 21.00 setiap harinya</p>
        </Modal>
              </div>
              </Col>
           </Row>


           {/* <Filter left={leftFilter} right={rightFilter}/> */}
           <DepositReport />

        <Card>
          <Table
            className="table-responsive"
            loading={loading}
            // rowKey={type === DEPOSIT_TYPES.CLIENTS ? 'id' : 'provider'}
            dataSource={data}
            columns={columns[type](this.clickTopup, hasAccess(ROLES_ITEMS.DEPOSIT_TOPUP))}
            pagination={false}
          />
        </Card>
      </div>
    )
  }
}

ClientDeposit.propTypes = {
  type: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
}

export default withRouter(ClientDeposit)
