import React from 'react'
import PropTypes from 'prop-types'
import { AnotherComponent, Enum } from './types'

const ComponentWithProps = props => <div {...props} />

class MyClass {
}

const personShape = PropTypes.shape({
  firstName: PropTypes.string,
  lastName: PropTypes.string
})

// Supported propTypes taken from
// https://reactjs.org/docs/typechecking-with-proptypes.html
ComponentWithProps.propTypes = {
  /**
   * Optional JS Array
   */
  optionalArray: PropTypes.array,

  /**
   * Optional JS Boolean
   */
  optionalBool: PropTypes.bool,

  /**
   * Optional JS Function
   */
  optionalFunc: PropTypes.func,

  /**
   * Optional JS Number
   */
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,

  // Anything that can be rendered: numbers, strings, elements or an array
  // (or fragment) containing these types.
  optionalNode: PropTypes.node,

  // A React element.
  optionalElement: PropTypes.element,

  // You can also declare that a prop is an instance of a class. This uses
  // JS's instanceof operator.
  optionalInstance: PropTypes.instanceOf(MyClass),

  // You can ensure that your prop is limited to specific values by treating
  // it as an enum.
  optionalEnum: PropTypes.oneOf(Enum),

  // An object that could be one of many types
  optionalUnion: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),

  optionalShape: personShape,

  externalComponent: PropTypes.shape(AnotherComponent.propTypes),

  // An array of a certain type
  optionalArrayOfPrimitives: PropTypes.arrayOf(PropTypes.number),

  optionalArrayOfShapes: PropTypes.arrayOf(personShape),

  optionalArrayOfAnotherComponent: PropTypes.arrayOf(PropTypes.shape(AnotherComponent.propTypes)),

  // An object with property values of a certain type
  optionalObjectOfPrimitive: PropTypes.objectOf(PropTypes.number),

  // An object taking on a particular shape
  optionalObjectOfShape: PropTypes.objectOf(personShape),

  // You can chain any of the above with `isRequired` to make sure a warning
  // is shown if the prop isn't provided.
  requiredFunc: PropTypes.func.isRequired,

  // A value of any data type
  requiredAny: PropTypes.any.isRequired,

  // You can also specify a custom validator. It should return an Error
  // object if the validation fails. Don't `console.warn` or throw, as this
  // won't work inside `oneOfType`.
  customProp: function (props, propName, componentName) {
    if (!/matchme/.test(props[propName])) {
      return new Error(
        'Invalid prop `' + propName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      )
    }
  },

  // You can also supply a custom validator to `arrayOf` and `objectOf`.
  // It should return an Error object if the validation fails. The validator
  // will be called for each key in the array or object. The first two
  // arguments of the validator are the array or object itself, and the
  // current item's key.
  customArrayProp: PropTypes.arrayOf(function (propValue, key, componentName, location, propFullName) {
    if (!/matchme/.test(propValue[key])) {
      return new Error(
        'Invalid prop `' + propFullName + '` supplied to' +
        ' `' + componentName + '`. Validation failed.'
      )
    }
  })
}

ComponentWithProps.defaultProps = {
  optionalBool: false,
  optionalString: 'This is the default string'
}

export default ComponentWithProps

export const OneMoreComponent = props => <div {...props} />

OneMoreComponent.propTypes = {
  name: PropTypes.string
}

export function test () {}
