
---

## 🚀 Установка

### 1. Установите Tampermonkey
- [Chrome](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Firefox](https://addons.mozilla.org/ru/firefox/addon/tampermonkey/)
- [Edge](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)

### 2. Установите скрипт

**Вариант 1: Прямая установка**
1. Скачайте файл [archive-archiver.user.js](archive-archiver.user.js)
2. Перетащите его в браузер с установленным Tampermonkey
3. Нажмите "Установить"

**Вариант 2: Ручная установка**
1. Откройте панель Tampermonkey
2. Нажмите "Создать новый скрипт"
3. Скопируйте содержимое [archive-archiver.user.js](archive-archiver.user.js)
4. Сохраните (`Ctrl+S`)

### 3. Готово!
Обновите любую страницу — в углу появится кнопка **📦 Archive**

---

## 🎯 Использование

### Основные функции

| Действие | Описание |
|----------|----------|
| **Нажать кнопку** | Открывает выпадающее меню |
| **Архивация текущей** | Сохраняет текущую страницу через archive.ph |
| **Архивация (новая вкладка)** | Открывает архив в новой вкладке |
| **Архивация по URL** | Введите любой URL для архивации |
| **Проверить статус** | Проверяет, есть ли страница в архиве |
| **Alt+A** | Быстрая архивация текущей страницы |

### Пример работы

1. Откройте любую страницу
2. Нажмите **📦 Archive** в углу экрана
3. Выберите нужное действие
4. Получите уведомление о результате

---

## ⚙️ Настройка

Отредактируйте объект `CONFIG` в начале скрипта:

```javascript
const CONFIG = {
    archiveUrl: 'https://archive.ph',  // или archive.today, archive.is
    buttonPosition: 'top-right',       // top-right, top-left, bottom-right, bottom-left
};
