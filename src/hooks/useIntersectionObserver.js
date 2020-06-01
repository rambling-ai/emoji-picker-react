import { useEffect, useContext, useRef } from 'react';
import { GROUP_NAME_RECENTLY_USED } from '../../lib/constants';
import { PROPERTY_DATA_NAME } from '../lib/constants';
import { actionTypes, PickerContext } from '../lib/reducer';
import globalObject from '../lib/globalObject';

const useIntersectionObserver = root => {
  const observer = useRef(null);

  const {
    state: { filterResult, activeCategory },
    dispatch,
  } = useContext(PickerContext);

  useEffect(() => {
    if (
      typeof globalObject.IntersectionObserver !== 'undefined' &&
      !observer.current &&
      root.current
    ) {
      observer.current = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            const { target } = entry;
            const id = target.getAttribute(PROPERTY_DATA_NAME);

            if (entry.intersectionRatio === 0) {
              if (id === activeCategory) {
                dispatch({
                  type: actionTypes.ACTIVE_CATEGORY_SET,
                  activeCategory: null,
                });
              } else if (id === GROUP_NAME_RECENTLY_USED) {
                const nextSibling = target.nextSibling;

                if (nextSibling) {
                  const id = nextSibling.getAttribute(PROPERTY_DATA_NAME);

                  dispatch({
                    type: actionTypes.ACTIVE_CATEGORY_SET,
                    activeCategory: id,
                  });
                }
              }
            } else if (!activeCategory) {
              dispatch({
                type: actionTypes.GROUP_SEEN_SET,
                group: id,
              });
              dispatch({
                type: actionTypes.ACTIVE_CATEGORY_SET,
                activeCategory: id,
              });
            }
          });
        },
        {
          root: root.current.parentElement,
        }
      );
    }

    observer.current.disconnect();

    if (!root || !root.current) {
      return;
    }

    [...root.current.querySelectorAll('.emoji-group')].forEach(target => {
      observer.current.observe(target);
    });
  }, [root.current, filterResult]);
};

export default useIntersectionObserver;