import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import PrivateRoute from './private-router'
import Order from '../pages/order'
import OrderDetail from '../pages/order/detail'
import Login from '../pages/login'
import Deposit from '../pages/deposit'
import Client from '../pages/client'
import Product from '../pages/product'
import ProductClientDetail from '../pages/product/client-detail'
import Page404 from '../pages/page-404'
import MENU from '../config/menu'

const RouteConfig = (
  <Router>
    <div>
      <Switch>
        <Route exact path={MENU.HOME} component={Login} />
        <Route exact path={MENU.LOGIN} component={Login} />
        <PrivateRoute exact path={MENU.ORDER} component={Order} />
        <PrivateRoute exact path={`${MENU.ORDER}/:type`} component={Order} />
        <PrivateRoute exact path={`${MENU.ORDER}/detail/:id`} component={OrderDetail} />
        <PrivateRoute exact path={MENU.DEPOSIT} component={Deposit} />
        <PrivateRoute exact path={`${MENU.DEPOSIT}/:type`} component={Deposit} />
        <PrivateRoute exact path={MENU.CLIENT} component={Client} />
        <PrivateRoute exact path={`${MENU.CLIENT}/:type`} component={Client} />
        <PrivateRoute exact path={MENU.PRODUCT} component={Product} />
        <PrivateRoute exact path={`${MENU.PRODUCT}/:type`} component={Product} />
        <PrivateRoute exact path={`${MENU.PRODUCT}/clients/:clientId/detail/:id`} component={ProductClientDetail} />
        <Route component={Page404} />
      </Switch>
    </div>
  </Router>
)

export default RouteConfig
