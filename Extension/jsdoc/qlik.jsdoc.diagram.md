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
    class NxExtension {
        string title
    }
    NxExtension *-- NxHyperCube: qHyperCube
    NxExtension *-- "0..1" ExtensionCustomProperties: customProperties

    NxHyperCube *-- "*" NxDimension: qDimensionInfo
    NxHyperCube *-- "*" NxMeasure: qMeasureInfo
    NxHyperCube *-- "*" NxDataPage: qDataPages

    class NxColumn {
         string qFallbackTitle 
         string othersLabel
    }

    class NxDimension {
         string qFallbackTitle 
         string othersLabel
    }
    NxDimension --|> NxColumn
    NxDimension o-- "0..1" DimensionCustomProperties: customProperties

    class NxMeasure {
         string qFallbackTitle 
         string othersLabel
    }
    NxMeasure --|> NxColumn
    NxMeasure o-- "0..1" MeasureCustomProperties: customProperties

    NxDataPage *-- "*" NxRow

    NxRow *-- "*" NxCell

    class NxCell {
        boolean qIsEmpty
        boolean qIsNull
        string qText
        number qNum
    }
    NxCell *-- NxAttributes: qAttrExps

    NxAttributes *-- "*" NxValue: qValues

    class NxValue {
        string qText
        number qNum 
    }

    class ExtensionCustomProperties {
        <<abstract>>
    }

    class ColumnCustomProperties {
        <<abstract>>
    }

    class DimensionCustomProperties {
        <<abstract>>
    }
    DimensionCustomProperties --|> ColumnCustomProperties

    class MeasureCustomProperties {
        <<abstract>>
    }
    MeasureCustomProperties --|> ColumnCustomProperties

```