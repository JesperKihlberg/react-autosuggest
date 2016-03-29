import styles from './SubMenus.less';
import theme from './theme.less';

import React, { Component } from 'react';
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

  return languages
    .map(section => {
      return {
        title: section.title,
        languages: section.languages.filter(language => regex.test(language.name))
      };
    })
    .filter(section => section.languages.length > 0);
}

function getSuggestionValue(suggestion) {
  return suggestion;
}

function getSubItemValue(subItem) {
  return subItem;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

function renderSubItem(subItem) {
  return (
    <span>{subItem.name}</span>
  );
}

function renderSectionTitle(section) {
  return (
    <strong>{section.title}</strong>
  );
}

function getSectionSuggestions(section) {
  return section.languages;
}

export default class SubMenus extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: getSuggestions(''),
      subItems: [],
      isPrimary: true
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
  }

  onChange(event, { newValue, method }) {
    if (newValue) {
      this.setState({
        value: newValue.name
      });
    }
    if (method == 'right') {
      this.setState({
        isPrimary: false
      });
    } else if (method == 'left' || method == 'type') {
      this.setState({
        isPrimary: true
      });
    } else if (method == 'mouseEnter') {
      if (newValue.submenu) {
        this.setState({
          value: newValue.name,
          subItems: newValue.submenu,
          isPrimary: true
        });
      } else {
        this.setState({
          value: newValue.name
        });
      }
    } else if (method == 'mouseLeave') {
      if (!this.state.isPrimary) {
        this.setState({
          value: newValue.name
        });
      }
    } else if (this.state.isPrimary) {
      this.setState({
        value: newValue.name,
        subItems: newValue.submenu
      });
    }
  }

  onSuggestionsUpdateRequested({ value }) {
    this.setState({
      suggestions: getSuggestions(value),
      subItems: []
    });
  }
  shouldRenderSuggestions() {
    return true;
  }
  render() {
    const { value, suggestions, subItems } = this.state;
    const inputProps = {
      placeholder: 'Type \'c\'',
      value,
      onChange: this.onChange
    };

    return (
      <div id="submenus-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>
            Multiple sections
          </div>
          <div className={styles.description}>
            Suggestions can also be presented in multiple sections.
          </div>
          <Link className={styles.codepenLink}
                href="http://codepen.io/moroshko/pen/qbRNjV" underline={false}>
            Codepen
          </Link>
        </div>
        <div className={styles.autosuggest}>
          <Autosuggest multiSection={true}
                       multiLevel={true}
                       suggestions={suggestions}
                       subItems={subItems}
                       onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                       getSuggestionValue={getSuggestionValue}
                       getSubItemValue={getSubItemValue}
                       renderSuggestion={renderSuggestion}
                       shouldRenderSuggestions={this.shouldRenderSuggestions}
                       renderSubItem={renderSubItem}
                       renderSectionTitle={renderSectionTitle}
                       getSectionSuggestions={getSectionSuggestions}
                       inputProps={inputProps}
                       focusInputOnSuggestionClick={focusInputOnSuggestionClick}
                       theme={theme}
                       id="submenus-example" />
        </div>
      </div>
    );
  }
}
