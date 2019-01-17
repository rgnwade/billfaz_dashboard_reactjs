import React from 'react'
import { Input, Button, Icon } from 'antd'
import PropTypes from 'prop-types'

import './table-control.scss'

const TableControl = ({
  additionalActionLeft,
  additionalActionRight,
  valPage,
  valPerPage,
  handlePrevPage,
  handleNextPage,
  search,
  disableSearch,
  searchText,
  searchValue,
  changeSearch,
  loading }) => (
    <div className="app-content__top">
      <div className="table-control__item">
        {
          !disableSearch && (
          <Input.Search
            className="table-control__search"
            placeholder={searchText}
            onSearch={value => search(value)}
            style={{ width: 300 }}
            value={searchValue}
            onChange={changeSearch}
          />)
        }
        {
          additionalActionLeft
          && <div className="table-control__additional-left">{additionalActionLeft}</div>
        }
      </div>
      <div className="table-control__item">
        {
          additionalActionRight
          && <div className="table-control__additional-right">{additionalActionRight}</div>
        }

        <Button.Group size="small">
          <Button disabled={valPage === 1 || !valPage || loading} type="primary" onClick={handlePrevPage}>
            <Icon type="left" />
          </Button>
          <Button disabled={valPerPage < 10 || loading} type="primary" onClick={handleNextPage}>
            <Icon type="right" />
          </Button>
        </Button.Group>

      </div>
    </div>
)

TableControl.defaultProps = {
  additionalActionLeft: null,
  additionalActionRight: null,
  valPage: 1,
  valPerPage: 10,
  handlePrevPage: () => {},
  handleNextPage: () => {},
  search: () => {},
  disableSearch: false,
  loading: false,
  searchText: 'Search',
  searchValue: '',
  changeSearch: () => {},
}

TableControl.propTypes = {
  valPage: PropTypes.number,
  valPerPage: PropTypes.number,
  handlePrevPage: PropTypes.func,
  handleNextPage: PropTypes.func,
  search: PropTypes.func,
  disableSearch: PropTypes.bool,
  loading: PropTypes.bool,
  additionalActionLeft: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]),
  additionalActionRight: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]),
  searchText: PropTypes.string,
  searchValue: PropTypes.string,
  changeSearch: PropTypes.func,
}

export default TableControl
