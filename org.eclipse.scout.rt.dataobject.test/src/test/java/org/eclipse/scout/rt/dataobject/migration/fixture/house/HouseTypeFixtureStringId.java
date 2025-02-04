/*
 * Copyright (c) 2010-2022 BSI Business Systems Integration AG.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     BSI Business Systems Integration AG - initial API and implementation
 */
package org.eclipse.scout.rt.dataobject.migration.fixture.house;

import org.eclipse.scout.rt.dataobject.id.AbstractStringId;
import org.eclipse.scout.rt.dataobject.id.IdTypeName;

@IdTypeName("charlieFixture.HouseTypeFixtureStringId")
public final class HouseTypeFixtureStringId extends AbstractStringId {

  private static final long serialVersionUID = 1L;

  public static HouseTypeFixtureStringId of(String id) {
    if (id == null) {
      return null;
    }
    return new HouseTypeFixtureStringId(id);
  }

  private HouseTypeFixtureStringId(String id) {
    super(id);
  }
}
