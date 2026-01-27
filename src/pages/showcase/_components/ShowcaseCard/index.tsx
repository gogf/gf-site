/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import Image from '@theme/IdealImage';
import {Tags, TagList, type TagType, type User} from '@site/src/data/users';
import {sortBy} from '@site/src/utils/jsUtils';
import Heading from '@theme/Heading';
import FavoriteIcon from '../FavoriteIcon';
import styles from './styles.module.css';

function TagItem({
  label,
  description,
  color,
}: {
  label: string;
  description: string;
  color: string;
}) {
  return (
    <li className={styles.tag} title={description}>
      <span className={styles.textLabel}>{label.toLowerCase()}</span>
      <span className={styles.colorLabel} style={{backgroundColor: color}} />
    </li>
  );
}

function ShowcaseCardTag({tags}: {tags: TagType[]}) {
  const tagObjects = tags.map((tag) => ({tag, ...Tags[tag]}));

  // Keep same order for all tags
  const tagObjectsSorted = sortBy(tagObjects, (tagObject) =>
    TagList.indexOf(tagObject.tag),
  );

  return (
    <>
      {tagObjectsSorted.map((tagObject, index) => {
        return <TagItem key={index} {...tagObject} />;
      })}
    </>
  );
}

function getCardImage(user: User): string {
  return (
    user.preview ??
    // TODO make it configurable
    `https://slorber-api-screenshot.netlify.app/${encodeURIComponent(
      user.website,
    )}/showcase`
  );
}

function getStarsUrl(source: string | null): string | null {
  if (!source || !source.includes('github.com')) {
    return null;
  }
  // Extract owner/repo from GitHub URL
  const match = source.match(/github\.com\/([^/]+)\/([^/]+)\/?$/);
  if (match) {
    const owner = match[1];
    const repo = match[2];
    return `https://img.shields.io/github/stars/${owner}/${repo}?style=flat`;
  }
  return null;
}

function ShowcaseCard({user}: {user: User}) {
  const image = getCardImage(user);
  const starsUrl = getStarsUrl(user.source);
  return (
    <li key={user.title} className="card shadow--md">
      <div className={clsx('card__image', styles.showcaseCardImage)}>
        <Image img={image} alt={user.title} />
      </div>
      <div className="card__body">
        <div className={clsx(styles.showcaseCardHeader)}>
          <Heading as="h4" className={styles.showcaseCardTitle}>
            <Link href={user.website} className={styles.showcaseCardLink}>
              {user.title}
            </Link>
          </Heading>
          {user.tags.includes('favorite') && (
            <FavoriteIcon size="medium"/>
          )}
          {starsUrl && (
            <img 
              src={starsUrl} 
              alt="GitHub stars"
              className={styles.starsImage}
            />
          )}
          {user.source && (
            <Link
              href={user.source}
              className={clsx(
                'button button--secondary button--sm',
                styles.showcaseCardSrcBtn,
              )}>
              <Translate id="showcase.card.sourceLink">源码</Translate>
            </Link>
          )}
        </div>
        <p className={styles.showcaseCardBody}>{user.description}</p>
      </div>
      <ul className={clsx('card__footer', styles.cardFooter)}>
        <ShowcaseCardTag tags={user.tags} />
      </ul>
    </li>
  );
}

export default React.memo(ShowcaseCard);
