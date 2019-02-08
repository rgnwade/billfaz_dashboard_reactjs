import React, { Component } from 'react'
import { Card, Table, message, Button, Row, Col, Select, DatePicker, TimePicker, Modal} from 'antd'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import TableControl from '../../../components/table-control'
import moment from 'moment'
import Filter from '../../../components/filter'
import columns from './columns'
import { DepositApi } from '../../../api'
import TopupModal from '../modal'
import { moneyToNumber } from '../../../utils/formatter/currency'
import { getErrorMessage } from '../../../utils/error/api'
import { DEPOSIT_TYPES } from '../../../config/deposit'
import { generateUrlQueryParams, parseUrlQueryParams, compareParams } from '../../../utils/url-query-params'
import MENU from '../../../config/menu'
import { hasAccess } from '../../../utils/roles'
import { ROLES_ITEMS } from '../../../config/roles'

const Option = Select.Option;
function handleChange(value) {
  console.log(`selected ${value}`);
}

const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
function onChange(date, dateString) {
  console.log(date, dateString);
}

const format = 'HH:mm';

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
  }

  componentDidUpdate(prevProps) {
    const { params, loading } = this.state
    const { location, active } = this.props
    if ((active && !loading && compareParams(prevProps.location, location, params)) || (!prevProps.active && active)) {
      this.getData(parseUrlQueryParams(location.search))
    }
  }

  changeModalDataAmount = (e) => {
    const { modalData } = this.state
    const val = Number.isNaN(parseInt(e.target.value, 10))
      ? e.target.value
      : moneyToNumber(e.target.value)
    this.setState({ ...this.state, modalData: { ...modalData, amount: val || 0 } })
  }

  getData = async (params = this.state.params) => {
    const { type } = this.props
    await this.setState({ ...this.state, loading: true })
    DepositApi.get(type, params)
      .then((res) => {
        const data = type === DEPOSIT_TYPES.CLIENTS ? res.data.deposits : res.data
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
    const { loading, size, data, params, valPerPage, modal, modalData, selected } = this.state
    const { type } = this.props
    const leftFilter = (
      <div className="flex">
         <div>
          <label className="small-text">Provider:</label>
              <div>
              <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>Disabled</Option>
              <Option value="Yiminghe">yiminghe</Option>
              </Select>
              </div>
        </div>
        <div>
        <label className="small-text">Provider:</label>
            <div>
             <DatePicker onChange={onChange} />
           </div>
        </div>
        <div>
        <label className="small-text">Provider:</label>
            <div>
         <TimePicker defaultValue={moment('12:08', format)} format={format} />
         </div>
        </div>
        <a class="total">To</a>
        <div>
        <label className="small-text">Provider:</label>
            <div>
             <DatePicker onChange={onChange} />
           </div>
        </div>
        <div>
        <label className="small-text">Provider:</label>
            <div>
         <TimePicker defaultValue={moment('12:08', format)} format={format} />
         </div>
        </div>
    </div>
    )

    const rightFilter = (

    <Button htmlType="submit" className="btn-oval" loading={loading} type="primary">EXPORT DATA</Button>)
    
    return (
      <div>
        <TableControl
          search={this.search}
          valPage={params.page}
          valPerPage={valPerPage}
          handlePrevPage={this.handlePrevPage}
          handleNextPage={this.handleNextPage}
          loading={loading}
          searchText={type === DEPOSIT_TYPES.CLIENTS ? 'Client Code' : 'Provider Name'}
          disableSearch={type === DEPOSIT_TYPES.PROVIDERS}
          searchValue={params.code}
          changeSearch={this.changeSearch}
        />
       
  
       <Row>
       <Col span={24}>
          
            <div className="app-actions__right">
              <a class="total">Total Deposit</a>
              <div class="top-up">Rp.546.875.089
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


           <Filter left={leftFilter} right={rightFilter}/>
    

        <Card>
          <Table
            className="table-responsive"
            loading={loading}
            rowKey={type === DEPOSIT_TYPES.CLIENTS ? 'id' : 'provider'}
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
