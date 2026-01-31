import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  markedDates: Set<string>;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDaysInMonth(year: number, month: number): Date[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: Date[] = [];

  // Add padding for days before first of month
  for (let i = 0; i < firstDay.getDay(); i++) {
    const date = new Date(year, month, -firstDay.getDay() + i + 1);
    days.push(date);
  }

  // Add days of current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    days.push(new Date(year, month, i));
  }

  // Add padding for days after last of month
  const remainingDays = 42 - days.length; // 6 rows * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    days.push(new Date(year, month + 1, i));
  }

  return days;
}

export function CalendarView({ selectedDate, onSelectDate, markedDates }: CalendarViewProps) {
  const [viewDate, setViewDate] = React.useState(new Date(selectedDate));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = getDaysInMonth(year, month);
  const today = new Date();

  const goToPreviousMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const isCurrentMonth = (date: Date) => date.getMonth() === month;
  const isToday = (date: Date) => formatDateKey(date) === formatDateKey(today);
  const isSelected = (date: Date) => formatDateKey(date) === formatDateKey(selectedDate);
  const hasLog = (date: Date) => markedDates.has(formatDateKey(date));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthYear}>
          {MONTHS[month]} {year}
        </Text>
        <TouchableOpacity onPress={goToNextMonth} style={styles.navButton}>
          <Text style={styles.navButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekDays}>
        {DAYS.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysGrid}>
        {days.map((date, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.day,
              isSelected(date) && styles.selectedDay,
              isToday(date) && styles.todayDay,
            ]}
            onPress={() => onSelectDate(date)}
          >
            <Text
              style={[
                styles.dayText,
                !isCurrentMonth(date) && styles.otherMonthText,
                isSelected(date) && styles.selectedDayText,
              ]}
            >
              {date.getDate()}
            </Text>
            {hasLog(date) && isCurrentMonth(date) && (
              <View style={[styles.dot, isSelected(date) && styles.selectedDot]} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 18,
    color: '#3b82f6',
    fontWeight: '600',
  },
  monthYear: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  todayDay: {
    borderWidth: 1,
    borderColor: '#3b82f6',
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: '#3b82f6',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 14,
    color: '#111827',
  },
  otherMonthText: {
    color: '#d1d5db',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3b82f6',
    position: 'absolute',
    bottom: 6,
  },
  selectedDot: {
    backgroundColor: '#fff',
  },
});
