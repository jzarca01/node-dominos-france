const axios = require('axios')
const faker = require('faker')
const { parseItem } = require('./utils')

class Dominos {
	constructor() {
		this.request = axios.create({
			baseURL: 'https://services.dominos.com.au',
			headers: {
				'User-Agent': 'Offers/1.0.8 (iPhone; iOS 11.4.1; Scale/2.00)'
			}
		})

		this.request.interceptors.request.use(
			axiosConfig => {
				if (axiosConfig.method === 'post') {
					axiosConfig.data = {
						...axiosConfig.data,
						RequestKey: {
							Application: 'iPhoneOffersEU',
							Culture: 'fr',
							Version: '1.0.8',
							Country: 'FR'
						},
						DeviceId: faker.random.uuid()
					}
				}
				return axiosConfig
			},
			error => Promise.reject(error)
		)
	}

	async getStores() {
		try {
			const stores = await this.request({
				method: 'GET',
				url: '/rest/FR/stores/all',
				responseType: 'json'
			})
			return stores.data
		} catch (err) {
			console.log('error with getStores', err)
		}
	}

	async getStoreDetails(storeId) {
		try {
			const stores = await this.getStores()
			return stores.find(store => store.StoreNo === parseInt(storeId))
		} catch (err) {
			console.log('error with getStores', err)
		}
	}

	async searchForStore(searchTerm) {
		try {
			const search = await this.request({
				method: 'POST',
				url: '/rest/soap/StoreSearch.svc/json/PickupSearch',
				data: {
					SearchString: searchTerm
				},
				responseType: 'json'
			})
			return search.data
		} catch (err) {
			console.log('error with searchForStore', err)
		}
	}

	async getStoreVouchers(storeId) {
		try {
			const vouchers = await this.request({
				method: 'POST',
				url: '/OffersApp/Vouchers/vouchersDetails',
				data: {
					StoreNumber: storeId
				},
				responseType: 'json'
			})
			const parsedVouchers = vouchers.data.Vouchers.map(async voucher => {
				const { VoucherCode, ExpiryDate, ServiceMethod } = voucher
				const { description } = await parseItem(voucher.Content)
				return {
					VoucherCode,
					ExpiryDate,
					ServiceMethod,
					description
				}
			})
			return parsedVouchers
		} catch (err) {
			console.log('error with getStoreVouchers', err)
		}
	}
}

module.exports = Dominos
