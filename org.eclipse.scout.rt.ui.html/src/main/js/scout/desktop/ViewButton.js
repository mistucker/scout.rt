// SCOUT GUI
// (c) Copyright 2013-2014, BSI Business Systems Integration AG

scout.ViewButton = function() {
  scout.ViewButton.parent.call(this);
  this.$title;
};
scout.inherits(scout.ViewButton, scout.Action);

scout.ViewButton.prototype._render = function($parent) {
  if (this._isMenu()) {
    this._renderAsMenu($parent);
  } else {
    this._renderAsTab($parent);
  }
};

scout.ViewButton.prototype._isMenu = function() {
  return this.displayStyle === 'MENU';
};

scout.ViewButton.prototype._isTab = function() {
  return this.displayStyle === 'TAB';
};

scout.ViewButton.prototype._renderAsMenu = function($parent) {
  this.$container = $parent.appendDiv('view-button-menu')
    .on('click', this._onClick.bind(this));
};

scout.ViewButton.prototype._renderAsTab = function($parent) {
  this.$container = $parent.appendDiv('view-button-tab')
    .on('click', this._onClick.bind(this));
  this.$title = this.$container.appendSpan('view-button-tab-title');
};

/**
 * @override Action.js
 */
scout.ViewButton.prototype._renderText = function(text) {
  if (this._isMenu()) {
    scout.ViewButton.parent.prototype._renderText.call(this, text);
  } else {
    this.$title.text(this.selected ? text : '');
  }
};

/**
 * @override Action.js
 */
scout.ViewButton.prototype._renderSelected = function(selected) {
  scout.ViewButton.parent.prototype._renderSelected.call(this, selected);
  if (this._isTab()) {
    if (this.selected) {
      this.$container.removeAttr('title');
      this.$title.text(this.text);
    } else {
      this.$container.attr('title', this.text); // FIXME AWE: (desktop) use pretty tooltips here
      this.$title.text('');
    }
  }
};

/**
 * Use a default icon, when view-tab doesn't define one.
 * @override Action.js
 */
scout.ViewButton.prototype._renderIconId = function(iconId) {
  if (this._isTab()) {
    this.$container.icon(this.getIconId(iconId));
  }
};

/**
 * Returns a default-icon when no icon is set.
 */
scout.ViewButton.prototype.getIconId = function(iconId) {
  if (arguments.length === 0) {
    iconId = this.iconId;
  }
  if (!scout.strings.hasText(iconId)) {
    iconId = 'font:\uE030'; // XXX AWE: icons.js - constant
  }
  return iconId;
};

scout.ViewButton.prototype._onClick = function() {
  this.doAction();
};

scout.ViewButton.prototype.last = function() {
  this.$container.addClass('last');
};
