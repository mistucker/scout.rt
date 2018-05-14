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
scout.TagBarLayout = function(tagBar) {
  scout.TagBarLayout.parent.call(this);
  this.tagBar = tagBar;
};
scout.inherits(scout.TagBarLayout, scout.AbstractLayout);

scout.TagBarLayout.prototype.layout = function($container) {
  var htmlContainer = scout.HtmlComponent.get($container);
  var hasTags = this.tagBar.tags && this.tagBar.tags.length > 0;

  if (hasTags) {
    var availableSize = htmlContainer.availableSize()
      .subtract(htmlContainer.insets());
    var maxTagsWidth = availableSize.width;
    var prefTagsWidth = 0;
    var overflow = false;

    // 1. check if overflow occurs
    var $te, i;
    var $tagElements = $container.find('.tag-element');
    var numTagElements = $tagElements.length;
    var teSizes = [];
    $tagElements.removeClass('hidden');

    // use a for loop, because don't want to loop all elements when we already know the rest is in overflow
    for (i = numTagElements - 1; i >= 0; i--) {
      $te = $($tagElements[i]);
      teSizes[i] = scout.graphics.size($te, {includeMargin: true});
      overflow = (prefTagsWidth + teSizes[i].width) > maxTagsWidth;
      if (overflow) {
        break;
      }
      prefTagsWidth += teSizes[i].width;
    }

    // 2. add overflow icon
    this.tagBar.setOverflowVisible(overflow);

    if (overflow) {
      prefTagsWidth = scout.graphics.size(this.tagBar.$overflowIcon, {includeMargin: true}).width;
      for (i = numTagElements - 1; i >= 0; i--) {
        $te = $($tagElements[i]);

        // all elements with a greater index are hidden for sure
        var teSize = teSizes[i];
        if (!teSize) {
          $te.addClass('hidden');
          continue;
        }

        // we must re-check the rest again, because we have added the
        // overflow icon and thus we have less space for tags
        if ((prefTagsWidth + teSizes[i].width) > maxTagsWidth) {
          $te.addClass('hidden');
        } else {
          prefTagsWidth += teSizes[i].width;
        }
      }
    }
  }
};

scout.TagBarLayout.prototype.preferredLayoutSize = function($container, options) {
  var htmlContainer = scout.HtmlComponent.get($container);
  var hasTags = this.tagBar.tags && this.tagBar.tags.length > 0;
  var availableSize = htmlContainer.availableSize();
  var prefTagsWidth = 0;

  if (!hasTags) {
    return new scout.Dimension(0, availableSize.height);
  }

  var $tagElements = $container.find('.tag-element');
  $tagElements.removeClass('hidden');
  $tagElements.each(function() {
    prefTagsWidth += scout.graphics.size($(this), {includeMargin: true}).width;
  });
  return new scout.Dimension(prefTagsWidth, availableSize.height);
};
