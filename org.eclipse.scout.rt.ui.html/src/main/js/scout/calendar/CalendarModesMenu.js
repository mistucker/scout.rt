/*******************************************************************************
 * Copyright (c) 2014-2017 BSI Business Systems Integration AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     BSI Business Systems Integration AG - initial API and implementation
 ******************************************************************************/
scout.CalendarModesMenu = function() {
  scout.CalendarModesMenu.parent.call(this);
  this.cssClass = 'calendar-mode-menu';
  this.displayMode;
};
scout.inherits(scout.CalendarModesMenu, scout.Menu);

scout.CalendarModesMenu.prototype._init = function(model) {
  scout.CalendarModesMenu.parent.prototype._init.call(this, model);
  this.calendar = this.parent;
  var menusToAdd = [];
  menusToAdd.push(scout.create('CalendarModeMenu', {
    parent: this,
    displayMode: scout.Calendar.DisplayMode.DAY,
    text: this.session.text('ui.CalendarDay')
  }));
  menusToAdd.push(scout.create('CalendarModeMenu', {
    parent: this,
    displayMode: scout.Calendar.DisplayMode.WORK_WEEK,
    text: this.session.text('ui.CalendarWorkWeek')
  }));
  menusToAdd.push(scout.create('CalendarModeMenu', {
    parent: this,
    displayMode: scout.Calendar.DisplayMode.WEEK,
    text: this.session.text('ui.CalendarWeek')
  }));
  menusToAdd.push(scout.create('CalendarModeMenu', {
    parent: this,
    displayMode: scout.Calendar.DisplayMode.MONTH,
    text: this.session.text('ui.CalendarMonth')
  }));
  this.addChildActions(menusToAdd);

  this.childActions.forEach(function(menu) {
    menu.on('propertyChange', this._onMenuPropertyChange.bind(this));
  }, this);

  this._setDisplayMode(this.displayMode);
};

scout.CalendarModesMenu.prototype.setDisplayMode = function(displayMode) {
  this.setProperty('displayMode', displayMode);
};

scout.CalendarModesMenu.prototype._setDisplayMode = function(displayMode) {
  this._setProperty('displayMode', displayMode);
  var menu = this.getMenuForMode(this.displayMode);
  menu.setSelected(true);
  this.setText(menu.text);
};

scout.CalendarModesMenu.prototype.getMenuForMode = function(displayMode) {
  return scout.arrays.find(this.childActions, function(menu) {
    return menu.displayMode === displayMode;
  });
};

scout.CalendarModesMenu.prototype._onMenuPropertyChange = function(event) {
  if (event.propertyName === 'selected') {
    var selected = event.newValue;
    if (selected) {
      var displayMode = event.source.displayMode;
      this.setDisplayMode(displayMode);
      this.calendar.setDisplayMode(displayMode);

      // unselect other menu items
      this.childActions.forEach(function(menu) {
        if (menu !== event.source) {
          menu.setSelected(false);
        }
      }, this);
    }
  }
};
