import PropTypes from 'prop-types'

export const Enum = ['News', 'Photos']

const AnotherComponent = props => <div {...props} />

AnotherComponent.propTypes = {
  str: PropTypes.string,
  num: PropTypes.number
}

export { AnotherComponent }
