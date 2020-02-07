import { ORDER_STATUS } from './order'

export const OPTIONS_CONFIG_ACTIVE = [
  {
    id: '',
    name: 'All',
  }, {
    id: 'true',
    name: 'Active',
  }, {
    id: 'false',
    name: 'Not active',
  },
]

export const OPTIONS_CONFIG_DEPOSIT = [
  {
    id: '',
    name: 'All',
  }, {
    id: 'payment',
    name: 'Payment',
  }, {
    id: 'refund',
    name: 'Refund',
  }, {
    id: 'topup',
    name: 'Top up',
  },
]

export const OPTIONS_CONFIG_PROBLEM = [
  {
    id: '',
    name: 'All',
  }, {
    id: 'true',
    name: 'Problem',
  }, {
    id: 'false',
    name: 'Not problem',
  },
]

export const OPTIONS_CONFIG_PROMO = [
  {
    id: '',
    name: 'All',
  }, {
    id: 'true',
    name: 'True',
  }, {
    id: 'false',
    name: 'False',
  },
]

export const FILTER_ORDER_STATUS = {
  PENDING: '1',
  ERROR: '2',
}

export const OPTIONS_CONFIG_ORDER_STATUS = [
  {
    id: '',
    name: 'All Status',
  }, {
    id: FILTER_ORDER_STATUS.PENDING,
    name: 'Pending',
  }, {
    id: FILTER_ORDER_STATUS.ERROR,
    name: 'Error',
  },
]

export const OPTIONS_CONFIG_CHANGE_ORDER_STATUS = [
  {
    id: ORDER_STATUS.SUCCESS,
    name: 'Success',
  }, {
    id: ORDER_STATUS.FAILED,
    name: 'Failed',
  },
]

export const REFUND_REASONS = {
  PROBLEM: 'ProductIsProblem',
  FAILED: 'TransactionFailed',
}

export const OPTIONS_CONFIG_REFUND_REASONS = [
  {
    id: REFUND_REASONS.PROBLEM,
    name: 'Product is in problem',
  }, {
    id: REFUND_REASONS.FAILED,
    name: 'Transaction is failed, please try again in a few minutes',
  },
]
