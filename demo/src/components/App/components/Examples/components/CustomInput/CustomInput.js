import styles from './CustomInput.less';

import React, { Component, TextInput } from 'react';
import isMobile from 'ismobilejs';
import Link from 'Link/Link';
import Autosuggest from 'AutosuggestContainer';
import languages from './languages';
import { escapeRegexCharacters } from 'utils/utils';

const focusInputOnSuggestionClick = !isMobile.any;

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(language => regex.test(language.name));
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}


class CustomElem extends Component {
  focus() { }
  render() {
    const input =  <input type="text" {...this.props} />;

    return <div className={styles.outerinput} > Input: {input} </div>;
  }
}

export default class CustomInput extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: getSuggestions('')
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue
    });
  }

  onSuggestionsUpdateRequested({ value }) {
    this.setState({
      suggestions: getSuggestions(value)
    });
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type \'c\'',
      value,
      onChange: this.onChange,
      type: 'text'
    };
    return (
      <div id="custominput-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>
            CustomInput
          </div>
          <div className={styles.description}>
            It is possible to provide a custom input element.
          </div>
          <Link className={styles.codepenLink}
                href="http://codepen.io/moroshko/pen/LGNJMy" underline={false}>
            Codepen
          </Link>
        </div>
        <div className={styles.autosuggest}>
          <Autosuggest suggestions={suggestions}
                       onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                       getSuggestionValue={getSuggestionValue}
                       renderSuggestion={renderSuggestion}
                       inputProps={inputProps}
                       focusInputOnSuggestionClick={focusInputOnSuggestionClick}
                       input={CustomElem}
                       id="custominput-example" />
        </div>
      </div>
    );
  }
}
