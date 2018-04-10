/*******************************************************************************
 * Copyright (c) 2010-2017 BSI Business Systems Integration AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     BSI Business Systems Integration AG - initial API and implementation
 ******************************************************************************/
package org.eclipse.scout.rt.client.ui.form.fields.filechooserbutton;

import java.util.List;

import org.eclipse.scout.rt.client.extension.ui.form.fields.filechooserbutton.IFileChooserButtonExtension;
import org.eclipse.scout.rt.client.ui.form.fields.AbstractValueField;
import org.eclipse.scout.rt.platform.Order;
import org.eclipse.scout.rt.platform.annotations.ConfigProperty;
import org.eclipse.scout.rt.platform.classid.ClassId;
import org.eclipse.scout.rt.platform.resource.BinaryResource;
import org.eclipse.scout.rt.platform.util.CollectionUtility;

@ClassId("8d2818c2-5659-4c03-87ef-09441302fbdd")
public abstract class AbstractFileChooserButton extends AbstractValueField<BinaryResource> implements IFileChooserButton {

  private List<String> m_fileExtensions;

  public AbstractFileChooserButton() {
    this(true);
  }

  public AbstractFileChooserButton(boolean callInitializer) {
    super(callInitializer);
  }

  /*
   * Configuration
   */
  @ConfigProperty(ConfigProperty.BOOLEAN)
  @Order(270)
  protected boolean getConfiguredShowFileExtension() {
    return true;
  }

  @ConfigProperty(ConfigProperty.FILE_EXTENSIONS)
  @Order(230)
  protected List<String> getConfiguredFileExtensions() {
    return null;
  }

  @ConfigProperty(ConfigProperty.LONG)
  @Order(310)
  protected long getConfiguredMaximumUploadSize() {
    return DEFAULT_MAXIMUM_UPLOAD_SIZE;
  }

  @Override
  protected boolean getConfiguredLabelVisible() {
    return false;
  }

  @Override
  protected void initConfig() {
    super.initConfig();
    setFileExtensions(getConfiguredFileExtensions());
    setMaximumUploadSize(getConfiguredMaximumUploadSize());
  }

  @Override
  public void setFileExtensions(List<String> a) {
    m_fileExtensions = CollectionUtility.arrayListWithoutNullElements(a);
  }

  @Override
  public List<String> getFileExtensions() {
    return CollectionUtility.arrayList(m_fileExtensions);
  }

  @Override
  public void setMaximumUploadSize(long maximumUploadSize) {
    propertySupport.setPropertyLong(PROP_MAXIMUM_UPLOAD_SIZE, maximumUploadSize);
  }

  @Override
  public long getMaximumUploadSize() {
    return propertySupport.getPropertyInt(PROP_MAXIMUM_UPLOAD_SIZE);
  }

  // Convenience file getter

  @Override
  public String getFileName() {
    BinaryResource value = getValue();
    if (value != null) {
      return value.getFilename();
    }
    return null;
  }

  @Override
  public int getFileSize() {
    BinaryResource value = getValue();
    if (value != null) {
      return value.getContentLength();
    }
    return 0;
  }

  protected static class LocalFileChooserButtonExtension<OWNER extends AbstractFileChooserButton> extends LocalValueFieldExtension<BinaryResource, OWNER> implements IFileChooserButtonExtension<OWNER> {

    public LocalFileChooserButtonExtension(OWNER owner) {
      super(owner);
    }
  }

  @Override
  protected IFileChooserButtonExtension<? extends AbstractFileChooserButton> createLocalExtension() {
    return new LocalFileChooserButtonExtension<>(this);
  }
}
