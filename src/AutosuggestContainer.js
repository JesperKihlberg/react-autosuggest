import React, { Component, PropTypes } from 'react';
import { createStore } from 'redux';
import reducer from './reducerAndActions';
import Autosuggest from './Autosuggest';

function noop() {}

const defaultTheme = {
  container: 'react-autosuggest__container',
  containerOpen: 'react-autosuggest__container--open',
  input: 'react-autosuggest__input',
  suggestionsContainer: 'react-autosuggest__suggestions-container',
  suggestion: 'react-autosuggest__suggestion',
  suggestionFocused: 'react-autosuggest__suggestion--focused',
  sectionContainer: 'react-autosuggest__section-container',
  sectionTitle: 'react-autosuggest__section-title',
  sectionSuggestionsContainer: 'react-autosuggest__section-suggestions-container',
  subItemsContainer: 'react-autowhatever__subitems-container',
  subItem: 'react-autowhatever__subitem',
  subItemFocused: 'react-autowhatever__subitem--focused'
};

function mapToAutowhateverTheme(theme) {
  let result = {};

  for (const key in theme) {
    switch (key) {
      case 'suggestionsContainer':
        result['itemsContainer'] = theme[key];
        break;

      case 'suggestion':
        result['item'] = theme[key];
        break;

      case 'suggestionFocused':
        result['itemFocused'] = theme[key];
        break;

      case 'sectionSuggestionsContainer':
        result['sectionItemsContainer'] = theme[key];
        break;

      default:
        result[key] = theme[key];
    }
  }

  return result;
}

export default class AutosuggestContainer extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired,
    subItems: PropTypes.array,
    onSuggestionsUpdateRequested: PropTypes.func,
    getSuggestionValue: PropTypes.func.isRequired,
    getSubItemValue: PropTypes.func,
    renderSuggestion: PropTypes.func.isRequired,
    renderSubItem: PropTypes.func,
    inputProps: (props, propName) => {
      const inputProps = props[propName];

      if (!inputProps.hasOwnProperty('value')) {
        throw new Error('\'inputProps\' must have \'value\'.');
      }

      if (!inputProps.hasOwnProperty('onChange')) {
        throw new Error('\'inputProps\' must have \'onChange\'.');
      }
    },
    input: PropTypes.func,
    shouldRenderSuggestions: PropTypes.func,
    onSuggestionSelected: PropTypes.func,
    onSubItemSelected: PropTypes.func,
    multiSection: PropTypes.bool,
    multiLevel: PropTypes.bool,
    isPrimaryFocused: PropTypes.bool,
    renderSectionTitle: PropTypes.func,
    getSectionSuggestions: PropTypes.func,
    focusInputOnSuggestionClick: PropTypes.bool,
    theme: PropTypes.object,
    id: PropTypes.string
  };

  static defaultProps = {
    onSuggestionsUpdateRequested: noop,
    shouldRenderSuggestions: value => value.trim().length > 0,
    onSuggestionSelected: noop,
    onSubItemSelected: noop,
    multiSection: false,
    multiLevel: false,
    renderSectionTitle() {
      throw new Error('`renderSectionTitle` must be provided');
    },
    renderSubItem() {
      throw new Error('`renderSubItem` must be provided');
    },
    getSectionSuggestions() {
      throw new Error('`getSectionSuggestions` must be provided');
    },
    focusInputOnSuggestionClick: true,
    theme: defaultTheme,
    id: '1'
  };

  constructor() {
    super();

    const initialState = {
      isFocused: false,
      isCollapsed: true,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      focusedSubItemIndex: null,
      isPrimaryFocused: true,
      valueBeforeUpDown: null,
      lastAction: null
    };

    this.store = createStore(reducer, initialState);

    this.saveInput = this.saveInput.bind(this);
  }

  saveInput(input) {
    this.input = input;
  }

  render() {
    const {
      multiSection, multiLevel, shouldRenderSuggestions, suggestions,
      subItems, onSuggestionsUpdateRequested, getSuggestionValue, getSubItemValue,
      renderSuggestion, renderSubItem, renderSectionTitle, getSectionSuggestions,
      inputProps, input, onSuggestionSelected, onSubItemSelected, focusInputOnSuggestionClick,
      theme, id
    } = this.props;

    return (
      <Autosuggest multiSection={multiSection}
                     multiLevel={multiLevel}
                   shouldRenderSuggestions={shouldRenderSuggestions}
                   suggestions={suggestions}
                     subItems={subItems}
                   onSuggestionsUpdateRequested={onSuggestionsUpdateRequested}
                   getSuggestionValue={getSuggestionValue}
                     getSubItemValue={getSubItemValue}
                   renderSuggestion={renderSuggestion}
                     renderSubItem={renderSubItem}
                   renderSectionTitle={renderSectionTitle}
                   getSectionSuggestions={getSectionSuggestions}
                   inputProps={inputProps}
                   input={input}
                   onSuggestionSelected={onSuggestionSelected}
                     onSubItemSelected={onSubItemSelected}
                   focusInputOnSuggestionClick={focusInputOnSuggestionClick}
                   theme={mapToAutowhateverTheme(theme)}
                   id={id}
                   inputRef={this.saveInput}
                   store={this.store} />
    );
  }
}
