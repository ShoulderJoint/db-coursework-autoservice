const { Builder, By, until } = require('selenium-webdriver');

async function runAddClientTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        await driver.get('http://localhost:5173');

        await driver.sleep(1000);

        await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'Личный кабинет')]")), 5000);
        await driver.findElement(By.xpath("//*[contains(text(), 'Личный кабинет')]")).click();

        await driver.wait(until.elementLocated(By.xpath("//input[@class='form-control']")), 5000);
        await driver.findElement(By.xpath("//input[@class='form-control']")).sendKeys('serezhka');
        await driver.findElement(By.xpath("//input[@type='password']")).sendKeys('123456lsa');
        await driver.findElement(By.xpath("//button[contains(text(), 'Войти')]")).click();

        await driver.wait(until.elementLocated(By.xpath("//li[text()='База клиентов']")), 5000);
        await driver.findElement(By.xpath("//li[text()='База клиентов']")).click();

        await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), '+ Добавить клиента')]")), 5000);
        await driver.findElement(By.xpath("//button[contains(text(), '+ Добавить клиента')]")).click();

        await driver.wait(until.elementLocated(By.xpath("//input[@placeholder='Фамилия']")), 5000);

        await driver.findElement(By.xpath("//input[@placeholder='Фамилия']")).sendKeys('Автоматизаторов');
        await driver.findElement(By.xpath("//input[@placeholder='Имя']")).sendKeys('Селен');
        await driver.findElement(By.xpath("//input[@placeholder='Отчество']")).sendKeys('Едваешевич');
        await driver.findElement(By.xpath("//input[@placeholder='Телефон (+7...)']")).sendKeys('+79998887766');
        await driver.findElement(By.xpath("//input[@placeholder='Почта (alex99@example.ru)']")).sendKeys('selenium@test.com');

        await driver.findElement(By.xpath("//button[contains(text(), 'Сохранить')]")).click();

        await driver.wait(async () => {
            const modals = await driver.findElements(By.css('.modal'));
            return modals.length === 0;
        }, 5000);

        console.log('Тест-кейс №1 пройден успешно: Клиент добавлен, модальное окно закрылось.');

    } catch (error) {
        console.error('Ошибка во время выполнения теста:', error);
    } finally {
        await driver.quit();
    }
}

runAddClientTest();