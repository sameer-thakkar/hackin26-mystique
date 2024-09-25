import { useEffect, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { TriangleIndicatorLeft } from 'assets/airportTransfers/searchUnitSVGs';
import { TIME_FORMAT, TIME_FORMAT_DISPLAY } from '../constants';
import { NumberList, ScrollableColumn, TimePickerWrapper } from './style';

export const ScrollableTimePicker = ({
  onTimeSelect,
  initTime,
}: {
  initTime: string; // in TIME_FORMAT
  onTimeSelect: (time: Dayjs) => void;
}) => {
  const initTimeParsed = dayjs(initTime, TIME_FORMAT);
  const initHour24 = initTimeParsed.hour();
  const initHour12 = initHour24 % 12 === 0 ? 12 : initHour24 % 12;

  const initMinute = initTimeParsed.minute();
  const initAmPmIndex = initHour24 < 12 ? 0 : 1;

  const [centerHourIndex, setCenterHourIndex] = useState(
    isNaN(initHour12) ? 12 : initHour12
  );
  const [centerMinuteIndex, setCenterMinuteIndex] = useState(
    () => initMinute / 15 // 0, 1, 2, 3 (index)
  );
  const [centerAmPmIndex, setCenterAmPmIndex] = useState(initAmPmIndex);

  const containerRef = useRef<HTMLDivElement>(null);

  const hourRef = useRef<HTMLUListElement>(null);
  const minuteRef = useRef<HTMLUListElement>(null);
  const amPmRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLLIElement;
            const index = element.dataset.index;

            if (!index) return;

            if (element.parentElement === hourRef.current) {
              setCenterHourIndex(parseInt(index));
            }

            if (element.parentElement === minuteRef.current) {
              setCenterMinuteIndex(parseInt(index));
            }

            if (element.parentElement === amPmRef.current) {
              setCenterAmPmIndex(parseInt(index));
            }
          }
        });
      },
      {
        root: containerRef.current,
        rootMargin: '-60px 0px', // to start detection at .picker-window
        threshold: 0.3,
      }
    );

    const items = containerRef.current?.querySelectorAll('.number');

    items?.forEach((item) => {
      observer.observe(item);
    });

    return () => {
      items?.forEach((item) => observer.unobserve(item));
    };
  }, []);

  useEffect(() => {
    // scroll to respective centers on mount

    const hourElement = hourRef.current?.querySelector(
      `.number[data-index='${centerHourIndex}']`
    );

    const minuteElement = minuteRef.current?.querySelector(
      `.number[data-index='${centerMinuteIndex}']`
    );

    const amPmElement = amPmRef.current?.querySelector(
      `.number[data-index='${centerAmPmIndex}']`
    );

    hourElement?.scrollIntoView({ block: 'center' });

    minuteElement?.scrollIntoView({ block: 'center' });

    amPmElement?.scrollIntoView({ block: 'center' });
  }, []);

  useEffect(() => {
    // set the time to the center values
    const hour = centerHourIndex;
    const minute = centerMinuteIndex * 15;
    const amPm = centerAmPmIndex === 0 ? 'AM' : 'PM';

    const parsedTime = dayjs(
      ` ${hour < 10 ? `0${hour}` : hour}:${
        minute < 10 ? `0${minute}` : minute
      } ${amPm}`,
      TIME_FORMAT_DISPLAY
    );

    onTimeSelect(parsedTime);
  }, [centerAmPmIndex, centerHourIndex, centerMinuteIndex, onTimeSelect]);

  return (
    <TimePickerWrapper ref={containerRef} data-qa-marker="time-picker">
      <TriangleIndicatorLeft />

      <div className="picker-window"></div>

      <ScrollableColumn>
        <NumberList ref={hourRef}>
          <li className="number-padding"></li>
          {Array.from({ length: 12 }).map((_, index) => (
            <li
              className={`number ${
                index + 1 === centerHourIndex ? 'center' : ''
              }`}
              key={index}
              data-index={index + 1}
              data-qa-marker={`hour-${index + 1}${
                index + 1 === centerHourIndex ? '-selected' : ''
              }`}
            >
              {index + 1 < 10 ? `0${index + 1}` : index + 1}
            </li>
          ))}
          <li className="number-padding"></li>
        </NumberList>
      </ScrollableColumn>

      <ScrollableColumn>
        <NumberList ref={minuteRef}>
          <li className="number-padding"></li>
          {Array.from({ length: 4 }).map((_, index) => (
            <li
              className={`number ${
                index === centerMinuteIndex ? 'center' : ''
              }`}
              key={index}
              data-index={index}
              data-qa-marker={`minute-${index}${
                index === centerMinuteIndex ? '-selected' : ''
              }`}
            >
              {index * 15 < 10 ? `0${index}` : index * 15}
            </li>
          ))}
          <li className="number-padding"></li>
        </NumberList>
      </ScrollableColumn>

      <ScrollableColumn>
        <NumberList ref={amPmRef}>
          <li className="number-padding"></li>
          {['AM', 'PM'].map((item, index) => (
            <li
              className={`number ${index === centerAmPmIndex ? 'center' : ''}`}
              key={index}
              data-index={index}
              data-qa-marker={`am-pm-${index}${
                index === centerAmPmIndex ? '-selected' : ''
              }`}
            >
              {item}
            </li>
          ))}
          <li className="number-padding"></li>
        </NumberList>
      </ScrollableColumn>

      <TriangleIndicatorLeft className="right" />
    </TimePickerWrapper>
  );
};
