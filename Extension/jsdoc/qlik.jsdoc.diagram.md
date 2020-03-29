# Описание Qlik API. Исходные данные диаграммы
## Обзор
> Данный файл представляет исходные данные для диаграммы классов Qlik API.

> Диаграмма описана с использованием расширение разметки [Mermaid](https://mermaid-js.github.io/mermaid/#/).
>
> Поскольку GitHub не поддерживает рендеринг этого раширения разметки, вставка осуществляется так:
> 1. Редактируется разметка в данном файле.
>    * Для работы в Visual Studio Code можно использовать плагины, например Markdown Preview Mermaid Support (bierner.markdown-mermaid).
>    * Можно также использовать онлайн-редактор.
> 1. Разметка вставляется в [онлайн-редактор](https://mermaid-js.github.io/mermaid-live-editor/), который генерирует ссылку для вставки.
> 1. Сгенерированная ссылка вставляется в целевое место md-файла.

## Диаграмма классов Qlik API
```mermaid
classDiagram
    class QlikExtension {
        string title
    }
    QlikExtension *-- QlikHyperCube: qHyperCube
    QlikExtension *-- "0..1" ExtensionProperties: properties

    QlikHyperCube *-- "*" QlikDimension: qDimensionInfo
    QlikHyperCube *-- "*" QlikMeasure: qMeasureInfo
    QlikHyperCube *-- "*" QlikDataPage: qDataPages

    class QlikColumn {
         string qFallbackTitle 
         string othersLabel
    }
    QlikColumn o-- "0..1" ColumnProperties: properties

    class QlikDimension {
         string qFallbackTitle 
         string othersLabel
    }
    QlikDimension --|> QlikColumn
    QlikDimension o-- "0..1" DimensionProperties: properties

    class QlikMeasure {
         string qFallbackTitle 
         string othersLabel
    }
    QlikMeasure --|> QlikColumn
    QlikMeasure o-- "0..1" MeasureProperties: properties

    QlikDataPage *-- "*" QlikRow

    QlikRow *-- "*" QlikCell

    class QlikCell {
        boolean qIsEmpty
        boolean qIsNull
        string qText
        number qNum
    }
    QlikCell *-- QlikAttributes: qAttrExps

    QlikAttributes *-- "*" QlikValue: qValues

    class QlikValue {
        string qText
        number qNum 
    }

    class ExtensionProperties {
        <<abstract>>
    }

    class ColumnProperties {
        <<abstract>>
    }

    class DimensionProperties {
        <<abstract>>
    }
    DimensionProperties --|> ColumnProperties

    class MeasureProperties {
        <<abstract>>
    }
    MeasureProperties --|> ColumnProperties

```