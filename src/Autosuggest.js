import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { inputFocused, inputBlurred, inputChanged, updateFocusedSuggestion,
         revealSuggestions, closeSuggestions } from './reducerAndActions';
import Autowhatever from 'react-autowhatever';

function mapStateToProps(state) {
  return {
    isFocused: state.isFocused,
    isCollapsed: state.isCollapsed,
    focusedSectionIndex: state.focusedSectionIndex,
    focusedSuggestionIndex: state.focusedSuggestionIndex,
    focusedSubItemIndex: state.focusedSubItemIndex,
    isPrimaryFocused: state.isPrimaryFocused,
    valueBeforeUpDown: state.valueBeforeUpDown,
    lastAction: state.lastAction
  };
}

function mapDispatchToProps(dispatch) {
  return {
    inputFocused: shouldRenderSuggestions => {
      dispatch(inputFocused(shouldRenderSuggestions));
    },
    inputBlurred: () => {
      dispatch(inputBlurred());
    },
    inputChanged: (shouldRenderSuggestions, lastAction) => {
      dispatch(inputChanged(shouldRenderSuggestions, lastAction));
    },
    updateFocusedSuggestion: (sectionIndex, suggestionIndex, subItemIndex, isPrimaryFocused, value) => {
      dispatch(updateFocusedSuggestion(sectionIndex, suggestionIndex, subItemIndex, isPrimaryFocused, value));
    },
    revealSuggestions: () => {
      dispatch(revealSuggestions());
    },
    closeSuggestions: lastAction => {
      dispatch(closeSuggestions(lastAction));
    }
  };
}

class Autosuggest extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired,
    subItems: PropTypes.array,
    onSuggestionsUpdateRequested: PropTypes.func.isRequired,
    getSuggestionValue: PropTypes.func.isRequired,
    getSubItemValue: PropTypes.func,
    renderSuggestion: PropTypes.func.isRequired,
    renderSubItem: PropTypes.func,
    inputProps: PropTypes.object.isRequired,
    shouldRenderSuggestions: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired,
    onSubItemSelected: PropTypes.func,
    multiSection: PropTypes.bool.isRequired,
    multiLevel: PropTypes.bool,
    isPrimaryFocused: PropTypes.bool,
    renderSectionTitle: PropTypes.func.isRequired,
    getSectionSuggestions: PropTypes.func.isRequired,
    focusInputOnSuggestionClick: PropTypes.bool.isRequired,
    theme: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    inputRef: PropTypes.func.isRequired,

    isFocused: PropTypes.bool.isRequired,
    isCollapsed: PropTypes.bool.isRequired,
    focusedSectionIndex: PropTypes.number,
    focusedSuggestionIndex: PropTypes.number,
    focusedSubItemIndex: PropTypes.number,
    valueBeforeUpDown: PropTypes.string,
    lastAction: PropTypes.string,

    inputFocused: PropTypes.func.isRequired,
    inputBlurred: PropTypes.func.isRequired,
    inputChanged: PropTypes.func.isRequired,
    updateFocusedSuggestion: PropTypes.func.isRequired,
    revealSuggestions: PropTypes.func.isRequired,
    closeSuggestions: PropTypes.func.isRequired
  };

  constructor() {
    super();

    this.saveInput = this.saveInput.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.suggestions !== this.props.suggestions) {
      const { suggestions, inputProps, shouldRenderSuggestions,
              isCollapsed, revealSuggestions, lastAction } = nextProps;
      const { value } = inputProps;

      if (isCollapsed && lastAction !== 'click' && lastAction !== 'enter' &&
          suggestions.length > 0 && shouldRenderSuggestions(value)) {
        revealSuggestions();
      }
    }
  }

  getSuggestion(sectionIndex, suggestionIndex) {
    const { suggestions, multiSection, getSectionSuggestions } = this.props;

    if (multiSection) {
      return getSectionSuggestions(suggestions[sectionIndex])[suggestionIndex];
    }

    return suggestions[suggestionIndex];
  }

  getSubItem(subItemIndex) {
    const { subItems } = this.props;

    return subItems[subItemIndex];
  }

  getFocusedSuggestion() {
    const { focusedSectionIndex, focusedSuggestionIndex } = this.props;

    if (focusedSuggestionIndex === null) {
      return null;
    }

    return this.getSuggestion(focusedSectionIndex, focusedSuggestionIndex);
  }

  getFocusedSubItem() {
    const { focusedSubItemIndex, isPrimaryFocused } = this.props;

    if (focusedSubItemIndex === null || isPrimaryFocused) {
      return null;
    }

    return this.getSubItem(focusedSubItemIndex);
  }

  getSuggestionValueByIndex(sectionIndex, suggestionIndex) {
    const { getSuggestionValue } = this.props;

    return getSuggestionValue(this.getSuggestion(sectionIndex, suggestionIndex));
  }

  getSubItemValueByIndex(subItemIndex) {
    const { getSubItemValue } = this.props;

    return getSubItemValue(this.getSubItem(subItemIndex));
  }

  getSuggestionIndices(suggestionElement) {
    const sectionIndex = suggestionElement.getAttribute('data-section-index');
    const suggestionIndex = suggestionElement.getAttribute('data-suggestion-index');

    return {
      sectionIndex: (typeof sectionIndex === 'string' ? parseInt(sectionIndex, 10) : null),
      suggestionIndex: parseInt(suggestionIndex, 10)
    };
  }

  findSuggestionElement(startNode) {
    let node = startNode;

    do {
      if (node.getAttribute('data-suggestion-index') !== null) {
        return node;
      }

      node = node.parentNode;
    } while (node !== null);

    console.error('Clicked element:', startNode); // eslint-disable-line no-console
    throw new Error('Couldn\'t find suggestion element');
  }

  maybeCallOnChange(event, newValue, method) {
    const { value, onChange } = this.props.inputProps;

    if (newValue !== value) {
      onChange && onChange(event, { newValue, method });
    }
  }

  maybeCallOnSuggestionsUpdateRequested(data) {
    const { onSuggestionsUpdateRequested, shouldRenderSuggestions } = this.props;

    if (shouldRenderSuggestions(data.value)) {
      onSuggestionsUpdateRequested(data);
    }
  }

  willRenderSuggestions() {
    const { suggestions, inputProps, shouldRenderSuggestions } = this.props;
    const { value } = inputProps;

    return suggestions.length > 0 && shouldRenderSuggestions(value);
  }

  saveInput(autowhatever) {
    if (autowhatever !== null) {
      const input = autowhatever.refs.input;

      this.input = input;
      this.props.inputRef(input);
    }
  }

  render() {
    const {
      suggestions, subItems, renderSuggestion, renderSubItem, inputProps, shouldRenderSuggestions,
      onSuggestionSelected, onSubItemSelected, multiSection, multiLevel, renderSectionTitle, id,
      getSectionSuggestions, focusInputOnSuggestionClick, theme, isFocused,
      isCollapsed, focusedSectionIndex, focusedSuggestionIndex, focusedSubItemIndex, isPrimaryFocused,
      valueBeforeUpDown, inputFocused, inputBlurred, inputChanged,
      updateFocusedSuggestion, revealSuggestions, closeSuggestions
    } = this.props;
    const { value, onBlur, onFocus, onKeyDown } = inputProps;
    const isOpen = isFocused && !isCollapsed && this.willRenderSuggestions();
    const items = (isOpen ? suggestions : []);
    const localSubItems = (isOpen ? subItems : []);
    const autowhateverInputProps = {
      ...inputProps,
      onFocus: event => {
        if (!this.justClickedOnSuggestion) {
          inputFocused(shouldRenderSuggestions(value));
          onFocus && onFocus(event);
        }
      },
      onBlur: event => {
        this.onBlurEvent = event;

        if (!this.justClickedOnSuggestion) {
          inputBlurred();
          onBlur && onBlur(event);

          if (valueBeforeUpDown !== null && value !== valueBeforeUpDown) {
            this.maybeCallOnSuggestionsUpdateRequested({ value, reason: 'blur' });
          }
        }
      },
      onChange: event => {
        const { value } = event.target;
        const { shouldRenderSuggestions } = this.props;

        this.maybeCallOnChange(event, value, 'type');
        inputChanged(shouldRenderSuggestions(value), 'type');
        this.maybeCallOnSuggestionsUpdateRequested({ value, reason: 'type' });
      },
      onKeyDown: (event, data) => {
        switch (event.key) {
          case 'ArrowDown':
          case 'ArrowUp':
            if (isCollapsed) {
              if (this.willRenderSuggestions()) {
                revealSuggestions();
              }
            } else if (suggestions && suggestions.length > 0) {
              const { newFocusedSectionIndex, newFocusedItemIndex, newFocusedSubItemIndex, focusedSectionIndex, focusedItemIndex, isPrimaryFocused } = data;

              if (isPrimaryFocused) {
                const newValue = newFocusedItemIndex === null ?
                    valueBeforeUpDown :
                    this.getSuggestionValueByIndex(newFocusedSectionIndex, newFocusedItemIndex);

                updateFocusedSuggestion(newFocusedSectionIndex, newFocusedItemIndex, null, isPrimaryFocused, value);
                this.maybeCallOnChange(event, newValue, event.key === 'ArrowDown' ? 'down' : 'up');
              } else {
                const newValue = newFocusedSubItemIndex === null ?
                    this.getSuggestionValueByIndex(newFocusedSectionIndex, newFocusedItemIndex) :
                    this.getSubItemValueByIndex(newFocusedSubItemIndex);

                updateFocusedSuggestion(focusedSectionIndex, focusedItemIndex, newFocusedSubItemIndex, isPrimaryFocused, value);
                this.maybeCallOnChange(event, newValue, event.key === 'ArrowDown' ? 'down' : 'up');
              }
            }
            event.preventDefault();
            break;
          case 'ArrowRight': {
            const { newFocusedSectionIndex, newFocusedItemIndex, newFocusedSubItemIndex, isPrimaryFocused } = data;

            if (subItems && subItems.length > 0) {
              const newValue = this.getSubItemValueByIndex(0);

              updateFocusedSuggestion(newFocusedSectionIndex, newFocusedItemIndex, newFocusedSubItemIndex, isPrimaryFocused, value);
              this.maybeCallOnChange(event, newValue, 'right');
            }
            break;
          }
          case 'ArrowLeft': {
            const { newFocusedSectionIndex, newFocusedItemIndex, newFocusedSubItemIndex, isPrimaryFocused } = data;
            const newValue = this.getSuggestionValueByIndex(newFocusedSectionIndex, newFocusedItemIndex);

            updateFocusedSuggestion(newFocusedSectionIndex, newFocusedItemIndex, newFocusedSubItemIndex, isPrimaryFocused, value);
            this.maybeCallOnChange(event, newValue, 'left');
            break;
          }
          case 'Enter': {
            const focusedSuggestion = this.getFocusedSuggestion();

            if (focusedSuggestion !== null) {
              const { isPrimaryFocused } = data;
              if (!this.willRenderSuggestions()) {
                closeSuggestions('enter');
              }
              if (isPrimaryFocused) {
                const focusedSuggestionValue = this.props.getSuggestionValue(focusedSuggestion);

                onSuggestionSelected(event, {
                  suggestion: focusedSuggestion,
                  suggestionValue: focusedSuggestionValue,
                  method: 'enter'
                });
                this.maybeCallOnSuggestionsUpdateRequested({ value, reason: 'enter' });
              } else {
                const focusedSubItem = this.getFocusedSubItem();

                if (focusedSubItem) {
                  const focusedSubItemValue = this.props.getSubItemValue(focusedSubItem);

                  this.maybeCallOnChange(event, focusedSubItemValue, 'enter');
                  onSubItemSelected(event, {
                    subItem: focusedSubItem,
                    subItemValue: focusedSubItemValue,
                    method: 'enter'
                  });
                }
              }
            }
            break;
          }

          case 'Escape':
            if (isOpen) {
              // If input.type === 'search', the browser clears the input
              // when Escape is pressed. We want to disable this default
              // behaviour so that, when suggestions are shown, we just hide
              // them, without clearing the input.
              event.preventDefault();
            }

            if (valueBeforeUpDown === null) { // Didn't interact with Up/Down
              if (!isOpen) {
                this.maybeCallOnChange(event, '', 'escape');
                this.maybeCallOnSuggestionsUpdateRequested({ value: '', reason: 'escape' });
              }
            } else { // Interacted with Up/Down
              this.maybeCallOnChange(event, valueBeforeUpDown, 'escape');
            }

            closeSuggestions('escape');
            break;
        }

        onKeyDown && onKeyDown(event);
      }
    };
    const onMouseEnter = (event, { sectionIndex, itemIndex, subItemIndex, isPrimaryFocused }) => {
      updateFocusedSuggestion(sectionIndex, itemIndex, subItemIndex, isPrimaryFocused);
      if (isPrimaryFocused) {
        const newValue = itemIndex === null ?
          valueBeforeUpDown :
          this.getSuggestionValueByIndex(sectionIndex, itemIndex);

        updateFocusedSuggestion(sectionIndex, itemIndex, null, isPrimaryFocused, value);
        this.maybeCallOnChange(event, newValue, 'mouseEnter');
      } else {
        const newValue = subItemIndex === null ?
          this.getSuggestionValueByIndex(focusedSectionIndex, focusedItemIndex) :
          this.getSubItemValueByIndex(subItemIndex);

        updateFocusedSuggestion(focusedSectionIndex, focusedSuggestionIndex, subItemIndex, isPrimaryFocused, value);
        this.maybeCallOnChange(event, newValue, 'mouseEnterSubMenu');
      }
    };
    const onMouseLeave = (event, { isPrimaryFocused }) => {
      const method = isPrimaryFocused ? 'mouseLeave' : 'mouseLeaveSubMenu';

      if (multiLevel && isPrimaryFocused) {
        if (subItems && subItems.length > 0) {
          updateFocusedSuggestion(focusedSectionIndex, focusedSuggestionIndex, null, true, valueBeforeUpDown);
          this.maybeCallOnChange(event, valueBeforeUpDown, method);
        } else {
          updateFocusedSuggestion(null, null, null, true, valueBeforeUpDown);
          this.maybeCallOnChange(event, valueBeforeUpDown, method);
        }
      } else {
        const newValue = this.getSuggestionValueByIndex(focusedSectionIndex, focusedSuggestionIndex);

        updateFocusedSuggestion(focusedSectionIndex, focusedSuggestionIndex, null, true, valueBeforeUpDown);
        this.maybeCallOnChange(event, newValue, method);
      }

    };
    const onMouseDown = () => {
      this.justClickedOnSuggestion = true;
    };
    const onClick = (event, { sectionIndex, itemIndex, subItemIndex, isPrimaryFocused }) => {
      let value;

      if (isPrimaryFocused) {
        const clickedSuggestion = this.getSuggestion(sectionIndex, itemIndex);
        const clickedSuggestionValue = this.props.getSuggestionValue(clickedSuggestion);

        value = clickedSuggestionValue;
        this.maybeCallOnChange(event, clickedSuggestionValue, 'click');
        onSuggestionSelected(event, {
          suggestion: clickedSuggestion,
          suggestionValue: clickedSuggestionValue,
          method: 'click'
        });
      } else {
        const clickedSubItem = this.getSubItem(subItemIndex);
        const clickedSubItemValue = this.props.getSubItemValue(clickedSubItem);

        value = clickedSubItemValue;
        this.maybeCallOnChange(event, clickedSubItemValue, 'click');
        onSubItemSelected(event, {
          subItem: clickedSubItem,
          subItemValue: clickedSubItemValue,
          method: 'click'
        });
      }
      if (!this.willRenderSuggestions()) {
        closeSuggestions('click');
      }

      if (focusInputOnSuggestionClick === true) {
        this.input.focus();
      } else {
        inputBlurred();
        onBlur && onBlur(this.onBlurEvent);
      }

      this.maybeCallOnSuggestionsUpdateRequested({ value: value, reason: 'click' });

      this.justClickedOnSuggestion = false;
    };
    const itemProps = ({ sectionIndex, itemIndex, subItemIndex, isPrimaryFocused }) => {
      return {
        'data-section-index': sectionIndex,
        'data-suggestion-index': itemIndex,
        subItemIndex,
        isPrimaryFocused,
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        onTouchStart: onMouseDown, // Because on iOS `onMouseDown` is not triggered
        onClick
      };
    };
    const renderItem = item => renderSuggestion(item, { value, valueBeforeUpDown });

    return (
      <Autowhatever multiSection={multiSection}
                    multiLevel={multiLevel}
                    items={items}
                    subItems={localSubItems}
                    renderItem={renderItem}
                    renderSubItem={renderSubItem}
                    renderSectionTitle={renderSectionTitle}
                    getSectionItems={getSectionSuggestions}
                    focusedSectionIndex={focusedSectionIndex}
                    focusedItemIndex={focusedSuggestionIndex}
                    focusedSubItemIndex={focusedSubItemIndex}
                    isPrimaryFocused={isPrimaryFocused}
                    inputProps={autowhateverInputProps}
                    itemProps={itemProps}
                    theme={theme}
                    id={id}
                    ref={this.saveInput} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Autosuggest);
