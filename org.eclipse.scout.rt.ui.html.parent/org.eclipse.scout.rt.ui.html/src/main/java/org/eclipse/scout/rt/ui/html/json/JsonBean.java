/*******************************************************************************
 * Copyright (c) 2010 BSI Business Systems Integration AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     BSI Business Systems Integration AG - initial API and implementation
 ******************************************************************************/
package org.eclipse.scout.rt.ui.html.json;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Modifier;
import java.util.Collection;

import org.eclipse.scout.commons.beans.FastBeanInfo;
import org.eclipse.scout.commons.beans.FastPropertyDescriptor;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Convert a java bean to a json object.
 * <p>
 * The java class may have public fields or getter/setter methods.
 * <p>
 * Valid data types are: boolean, int, long, String, byte[], array or {@link Collection} of before mentioned types.
 *
 * @param o
 *          the java bean
 * @return {@link JSONObject}, {@link JSONArray} or a basic type
 */
public class JsonBean implements IJsonObject {
  private Object m_bean;
  private IJsonObjectFactory m_objectFactory;

  public JsonBean(Object bean, IJsonObjectFactory objectFactory) {
    m_bean = bean;
    m_objectFactory = objectFactory;
  }

  @Override
  public Object toJson() {
    if (m_bean == null) {
      return null;
    }

    Class<?> type = m_bean.getClass();
    // basic types
    if (type.isPrimitive() || type == String.class || type == Integer.class || type == Long.class || type == Boolean.class) {
      return m_bean;
    }

    // array
    if (type.isArray()) {
      JSONArray jsonArray = new JSONArray();
      int n = Array.getLength(m_bean);
      for (int i = 0; i < n; i++) {
        IJsonObject jsonObject = m_objectFactory.createJsonObject(Array.get(m_bean, i));
        jsonArray.put(jsonObject.toJson());
      }
      return jsonArray;
    }

    // collection
    if (Collection.class.isAssignableFrom(type)) {
      JSONArray jsonArray = new JSONArray();
      Collection collection = (Collection) m_bean;
      for (Object object : collection) {
        IJsonObject jsonObject = m_objectFactory.createJsonObject(object);
        jsonArray.put(jsonObject.toJson());
      }
      return jsonArray;
    }

    // bean
    if (type.getName().startsWith("java.")) {
      throw new IllegalArgumentException("Cannot convert " + type + " to json object");
    }
    try {
      JSONObject jbean = new JSONObject();
      for (Field f : type.getFields()) {
        if (Modifier.isStatic(f.getModifiers())) {
          continue;
        }
        String key = f.getName();
        Object val = f.get(m_bean);
        IJsonObject jsonObject = m_objectFactory.createJsonObject(val);
        jbean.put(key, jsonObject.toJson());
      }
      FastBeanInfo beanInfo = new FastBeanInfo(type, Object.class);
      for (FastPropertyDescriptor desc : beanInfo.getPropertyDescriptors()) {
        Method m = desc.getReadMethod();
        if (m == null) {
          continue;
        }
        String key = desc.getName();
        Object val = m.invoke(m_bean);
        IJsonObject jsonObject = m_objectFactory.createJsonObject(val);
        jbean.put(key, jsonObject.toJson());
      }
      return jbean;
    }
    catch (Exception e) {
      throw new IllegalArgumentException(type + " to json", e);
    }
  }

}
