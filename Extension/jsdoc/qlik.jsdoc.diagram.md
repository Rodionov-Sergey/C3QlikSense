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
> 1. Сгенерированная сылка вставляется в целевое место md-файла.

## Диаграмма классов Qlik API
```mermaid
classDiagram
    class QlikLayout {
        string title
    }
    QlikLayout *-- NxHyperCube: qHyperCube
    QlikLayout *-- "0..1" ExtensionCustomProperties: customProperties

    NxHyperCube *-- "*" NxDimension: qDimensionInfo
    NxHyperCube *-- "*" NxMeasure: qMeasureInfo
    NxHyperCube *-- "*" NxDataPage: qDataPages

    class NxDimension {
         string qFallbackTitle 
         string othersLabel
    }
    NxDimension o-- "0..1" ColumnCustomProperties: customProperties
    
    class NxMeasure {
         string qFallbackTitle 
         string othersLabel
    }
    NxMeasure o-- "0..1" ColumnCustomProperties: customProperties

    NxDataPage *-- "*" NxCellRows

    NxCellRows *-- "*" NxCell

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

    class ColumnCustomProperties{
        <<abstract>>
    }
```