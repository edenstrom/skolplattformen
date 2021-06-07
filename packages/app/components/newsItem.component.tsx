import { RouteProp } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { useNewsDetails } from '@skolplattformen/api-hooks'
import { StyleService, Text, useStyleSheet } from '@ui-kitten/components'
import moment from 'moment'
import 'moment/locale/sv'
import React from 'react'
import { ScrollView, View } from 'react-native'
import { NativeStackNavigationOptions } from 'react-native-screens/native-stack'
import { defaultStackStyling } from '../design/navigationThemes'
import { Colors, Layout, Sizing, Typography } from '../styles'
import { translate } from '../utils/translation'
import { Image } from './image.component'
import { Markdown } from './markdown.component'
import { RootStackParamList } from './navigation.component'

interface NewsItemProps {
  navigation: StackNavigationProp<RootStackParamList, 'NewsItem'>
  route: RouteProp<RootStackParamList, 'NewsItem'>
}

const displayDate = (date: string | undefined) => moment(date).format('lll')

const dateIsValid = (date: string | undefined) =>
  moment(date, moment.ISO_8601).isValid()

export const newsItemRouteOptions = ({
  route,
}: {
  route: RouteProp<RootStackParamList, 'NewsItem'>
}): NativeStackNavigationOptions => {
  const newsItem = route.params.newsItem

  return {
    ...defaultStackStyling,
    title: newsItem.header,
  }
}

export const NewsItem = ({ route }: NewsItemProps) => {
  const { newsItem, child } = route.params
  const { data } = useNewsDetails(child, newsItem)
  const styles = useStyleSheet(themedStyles)
  const stylesMarkdown = useStyleSheet(themedStylesMarkdown)

  return (
    <ScrollView
      contentContainerStyle={styles.article}
      style={styles.scrollView}
    >
      <Text maxFontSizeMultiplier={2} style={styles.title}>
        {newsItem.header}
      </Text>
      {dateIsValid(newsItem.published) && (
        <Text
          maxFontSizeMultiplier={2}
          style={[styles.subtitle, styles.published]}
        >
          <Text style={styles.strong}>{translate('news.published')}:</Text>{' '}
          {displayDate(newsItem.published)}
        </Text>
      )}
      {dateIsValid(newsItem.modified) && (
        <Text maxFontSizeMultiplier={2} style={styles.subtitle}>
          <Text style={styles.strong}>{translate('news.updated')}:</Text>{' '}
          {displayDate(newsItem.modified)}
        </Text>
      )}
      <View style={styles.body}>
        <Markdown style={stylesMarkdown}>{data.body}</Markdown>
        {newsItem.fullImageUrl && (
          <Image
            accessibilityIgnoresInvertColors={false}
            src={newsItem.fullImageUrl}
            // @ts-expect-error Fix later on
            style={styles.image}
          />
        )}
      </View>
    </ScrollView>
  )
}

const themedStylesMarkdown = StyleService.create({
  body: {
    ...Typography.fontSize.base,
    color: 'color-basic-800',
    lineHeight: 26,
  },
  heading1: {
    ...Typography.fontSize.xl,
    color: 'color-basic-600',
  },
  heading2: {
    ...Typography.fontSize.lg,
    color: 'color-basic-800',
  },
  code_block: {
    color: 'color-basic-800',
    backgroundColor: 'background-basic-color-1',
    borderColor: 'color-basic-400',
  },
})

const themedStyles = StyleService.create({
  safeArea: {
    ...Layout.flex.full,
    backgroundColor: Colors.neutral.white,
  },
  topContainer: {
    ...Layout.flex.row,
    ...Layout.crossAxis.spaceBetween,
  },
  article: {
    padding: Sizing.t5,
    backgroundColor: 'background-basic-color-2',
  },
  scrollView: {
    ...Layout.flex.full,
  },
  image: {
    width: '100%',
    minHeight: 300,
    marginTop: Sizing.t4,
    borderRadius: 15,
  },
  title: {
    ...Typography.fontWeight.bold,
    fontSize: 30,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.fontSize.xs,
    color: 'color-basic-600',
  },
  strong: {
    ...Typography.fontSize.xs,
    ...Typography.fontWeight.bold,
    color: 'color-basic-600',
  },
  published: {
    marginBottom: Sizing.t1,
  },
  body: {
    marginTop: Sizing.t4,
  },
  topNavigationTitle: {
    ...Typography.fontWeight.semibold,
  },
})
