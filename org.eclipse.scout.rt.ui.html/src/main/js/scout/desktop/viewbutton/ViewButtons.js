/*******************************************************************************
 * Copyright (c) 2014-2015 BSI Business Systems Integration AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     BSI Business Systems Integration AG - initial API and implementation
 ******************************************************************************/
scout.ViewButtons = function() {
  scout.ViewButtons.parent.call(this);
  this.viewMenuTab;
  this._desktopOutlineChangedHandler = this._onDesktopOutlineChanged.bind(this);
};
scout.inherits(scout.ViewButtons, scout.Widget);

scout.ViewButtons.prototype._init = function(model) {
  scout.ViewButtons.parent.prototype._init.call(this, model);
  this.desktop = this.session.desktop;
};

scout.ViewButtons.prototype._initKeyStrokeContext = function(keyStrokeContext) {
  scout.DesktopHeader.parent.prototype._initKeyStrokeContext.call(this, keyStrokeContext);

  // Bound to desktop
  this.desktopKeyStrokeContext = new scout.KeyStrokeContext();
  this.desktopKeyStrokeContext.invokeAcceptInputOnActiveValueField = true;
  this.desktopKeyStrokeContext.$bindTarget = this.desktop.$container;
  this.desktopKeyStrokeContext.$scopeTarget = this.$container;
  this.desktopKeyStrokeContext.registerKeyStroke([
    new scout.ViewMenuOpenKeyStroke(this)
  ].concat(this.desktop.viewButtons));
};

scout.ViewButtons.prototype._render = function($parent) {
  var viewTabs;

  this.$container = $parent.appendDiv('view-buttons');
  this.htmlComp = new scout.HtmlComponent(this.$container, this.session);
  this.htmlComp.setLayout(new scout.ViewButtonsLayout(this));
  this.viewMenuTab = scout.create('ViewMenuTab', {parent: this,
    viewMenus: this._viewButtons('MENU')
  });
  this.viewMenuTab.render(this.$container);

  viewTabs = this._viewButtons('TAB');
  this._viewButtons('TAB').forEach(function(viewTab, i) {
    viewTab.setParent(this);
    viewTab.render(this.$container);
    if (i === viewTabs.length - 1) {
      viewTab.last();
    }
  }, this);
  this.session.keyStrokeManager.installKeyStrokeContext(this.desktopKeyStrokeContext);

  this._onDesktopOutlineChanged();
  this.desktop.on('outlineChanged', this._desktopOutlineChangedHandler);
};

scout.ViewButtons.prototype._remove = function() {
  this.desktop.off('outlineChanged', this._desktopOutlineChangedHandler);
  this.session.keyStrokeManager.uninstallKeyStrokeContext(this.desktopKeyStrokeContext);
  scout.ViewButtons.parent.prototype._remove.call(this);
};

scout.ViewButtons.prototype._viewButtons = function(displayStyle) {
  var viewButtons = [];
  this.desktop.viewButtons.forEach(function(viewButton) {
    if (displayStyle === undefined ||
      displayStyle === viewButton.displayStyle) {
      viewButtons.push(viewButton);
    }
  });
  return viewButtons;
};

scout.ViewButtons.prototype.doViewMenuAction = function(event) {
  this.viewMenuTab.togglePopup(event);
};

/**
 * This method updates the state of the view-menu-tab and the selected state of outline-view-buttons.
 * This method must also work in offline mode.
 */
scout.ViewButtons.prototype._onDesktopOutlineChanged = function(event) {
  var outline = this.desktop.outline;
  this.viewMenuTab.onOutlineChanged(outline);
  this._viewButtons().forEach(function(viewTab) {
    if (viewTab instanceof scout.OutlineViewButton) {
      viewTab.onOutlineChanged(outline);
    }
  });
};
