import { LocalContractStorage, Blockchain, StorageMap } from "./System";

interface IProfile {
    nickname: string;
    bio: string;
    avatar?: string;
}

class Profile implements IProfile {
    nickname: string;
    bio: string;
    avatar?: string;

    constructor(nickname: string, bio: string, avatar?: string) {
        this.nickname = nickname
        this.bio = bio
        this.avatar = avatar
    }

    toString() {
        return JSON.stringify(this);
    }

}

class NasID {
    profile: StorageMap;
    constructor() {
        LocalContractStorage.defineMapProperty(this, "profile", {
            parse(text) {
                const { nickname, bio, avatar } = JSON.parse(text) as IProfile
                return new Profile(nickname, bio, avatar);
            },
            stringify(o) {
                return o.toString();
            }
        });
    };

    init() {

    }

    saveProfile(avatar, nickname, bio) {
        avatar = avatar.trim();
        nickname = nickname.trim();
        bio = bio.trim();

        var key = Blockchain.transaction.from;
        var dictItem = this.profile.get(key);

        if (dictItem) {
            this.profile.del(key);
        }

        dictItem = new Profile(nickname, bio, avatar);
        this.profile.set(key, dictItem);
    }

    getProfile(address): IProfile {
        const profile = this.profile.get(address) as IProfile
        return profile || {
            nickname: "匿名用户",
            bio: ""
        }
    }

    getMyProfile(): IProfile {
        const { from } = Blockchain.transaction
        return this.getProfile(from)
    }

    delMyProfile(): boolean {
        const { from } = Blockchain.transaction
        var dictItem = this.profile.get(from);

        if (dictItem) {
            this.profile.del(from);
            return true;
        } else {
            return false;
        }
    }
}

module.exports = NasID;