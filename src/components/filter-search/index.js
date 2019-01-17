import React, { Component } from 'react'
import { Popover, Icon, Input } from 'antd'
import PropTypes from 'prop-types'

import './filter-search.scss'

class Region extends Component {
  constructor(props) {
    super(props)
    this.state = {
      options: this.props.options,
      optionsFiltered: this.props.options,
    }
  }

  componentDidMount() {
    const data = this.props.options
    const { options } = this.state
    const { textAll, noAll } = this.props
    if (!noAll && (options.length <= 0 || (options.length > 0 && options[0].id))) data.unshift({ id: '', name: textAll })
    this.setState({
      ...this.state,
      options: data,
      optionsFiltered: data,
    })
  }

  componentDidUpdate(prevProps) {
    const { options, textAll, noAll } = this.props
    const arrayOfDataCodes = options.map(item => item.id)
    if (options.length !== prevProps.options.length || (options.length > 0 && !(
      options.length === prevProps.options.length
      && prevProps.options
        .map(item => arrayOfDataCodes.includes(item.id))
        .reduce((prev, curr) => prev && curr)
    ))) {
      if (!noAll && (options.length <= 0 || (options.length > 0 && options[0].id))) options.unshift({ id: '', name: textAll })
      this.setState({ ...this.state, options, optionsFiltered: options })
    }
  }

  search = (e) => {
    const { value } = e.target
    if (value) this.setState({ ...this.state, optionsFiltered: this.state.options.filter(item => item.name.toLowerCase().includes(value.toLowerCase())) })
    else this.setState({ ...this.state, optionsFiltered: this.state.options })
  }

  render() {
    const { options, optionsFiltered } = this.state
    const { clickFilter, selected } = this.props
    const content = (
      <div>
        <Input.Search
          className="app-filter-search__search"
          placeholder="Search"
          onChange={this.search}
        />
        <ul className="app-filter-search__list">
          {
            optionsFiltered.map(item => (
              <li className="app-filter-search__item" key={item.id}>
                <button type="button" onClick={() => clickFilter(item)}>{item.name}</button>
              </li>
            ))
          }
        </ul>
      </div>
    )
    return (
      <Popover className="app-filter-search__popover" content={content} title="" placement="bottom">
        <div className="app-filter-search__view-pop">
          <span>{selected.name || (options && options.length > 0 && options[0].name)}</span>
          <Icon type="down" />
        </div>
      </Popover>
    )
  }
}

Region.defaultProps = {
  options: [], // format data; { name: xxx, id: xxx }
  clickFilter: () => {},
  selected: {},
  textAll: 'ALL ITEMS',
  noAll: false,
}

Region.propTypes = {
  clickFilter: PropTypes.func,
  selected: PropTypes.object,
  options: PropTypes.array,
  textAll: PropTypes.string,
  noAll: PropTypes.bool,
}

export default Region
